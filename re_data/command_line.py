import click
import subprocess
import json
from datetime import date, timedelta
import shutil

import os
from re_data.templating import render
from re_data.include import OVERVIEW_INDEX_FILE_PATH
from http.server import SimpleHTTPRequestHandler
import webbrowser
from socketserver import TCPServer
from yachalk import chalk
import yaml
from re_data.notifications.slack import slack_notify
from re_data.utils import format_alerts_to_table
from dbt.config.project import Project
from re_data.tracking import anonymous_tracking


def add_options(options):
    def _add_options(func):
        for option in reversed(options):
            func = option(func)
        return func
    return _add_options

def add_dbt_flags(command_list, flags):
    for key, value in flags.items():
        if value:
            key = key.replace('_', '-')
            command_list.extend([f'--{key}', value])
    print(' '.join(command_list))

def get_target_paths(kwargs, re_data_target_dir=None):
    project_root = os.getcwd() if not kwargs.get('project_dir') else os.path.abspath(kwargs['project_dir'])
    partial = Project.partial_load(project_root)
    dbt_target_path = os.path.abspath(partial.project_dict['target-path'])

    if re_data_target_dir:
        re_data_target_path = os.path.abspath(re_data_target_dir)
    else:
        re_data_target_path = os.path.join(dbt_target_path, 're_data')

    return dbt_target_path, re_data_target_path


dbt_profile_option = click.option(
    '--profile',
    type=click.STRING,
    help="""
        Which profile to load. Overrides setting in dbt_project.yml
    """
)
dbt_target_option = click.option(
    '--target',
    type=click.STRING,
    help="""
        Which target to load for the given profile.
    """
)
dbt_profiles_dir_option = click.option(
    '--profiles-dir',
    type=click.STRING,
    help="""
        Which directory to look in for the profiles.yml file.
        Default = ~/.dbt
    """
)
dbt_project_dir_option = click.option(
    '--project-dir',
    type=click.STRING,
    help="""
        Which directory to look in for the dbt_project.yml
        file. Default is the current working directory and its
        parents
    """
)
dbt_flags = [
    dbt_profile_option,
    dbt_target_option,
    dbt_project_dir_option,
    dbt_profiles_dir_option,
]


@click.group(help=f"re_data CLI")
def main():
    pass


@main.command()
@click.argument(
    'project_name'
)
@anonymous_tracking
def init(project_name):
    print(f"Creating {project_name} template project")
    dir_path = os.path.dirname(os.path.realpath(__file__))
    shutil.copytree(os.path.join(dir_path, 'dbt_template'), project_name)

    with open(f"{project_name}/dbt_project.yml", "w") as f:
        f.write(render.render_dbt_project(project_name))

    bash_command = f'cd {project_name} && dbt deps'
    response = os.system(bash_command)

    if not response:
        info = chalk.green("SUCCESS")
    else:
        info = chalk.red("FAILURE")

    print(f"Creating {project_name} template project", info)

    if not response:
        print(f"Setup profile & re_data:schemas var in dbt_project.yml", "INFO")


@main.command()
@add_options(dbt_flags)
@anonymous_tracking
def detect(**kwargs):
    print(f"Detecting tables", "RUN")

    run_list = ['dbt', 'run', '--models', 're_data_columns', 're_data_monitored']
    add_dbt_flags(run_list, kwargs)
    completed_process = subprocess.run(run_list)
    completed_process.check_returncode()

    print(f"Detecting tables", "SUCCESS")


@main.command()
@click.option(
    '--start-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today() - timedelta(days=1)),
    help="Specify starting date to compute monitoring data, by default re_data will use yesterday for that value"
)
@click.option(
    '--end-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today()),
    help="""
        Specify end date to compute monitoring data, by default re_data will use today for that.
        And compute stats for last full data for that
    """
)
@click.option(
    '--interval',
    type=click.STRING,
    default='days:1',
    help="""
        Specify interval format. e.g. `days:1` translates to a time interval of 1 day
    """
)
@click.option(
    '--full-refresh',
    is_flag=True,
    help='Warning! If specified re_data runs first dbt run with --full-refresh option cleaning all previously gathered profiling information'
)
@add_options(dbt_flags)
@anonymous_tracking
def run(start_date, end_date, interval, full_refresh, **kwargs):
    for_date = start_date

    time_grain, num_str = interval.split(':')
    num = int(num_str)

    if time_grain == 'days':
        delta = timedelta(days=num)
    elif time_grain == 'hours':
        delta = timedelta(hours=num)
    else:
        raise Exception(f"Unsupported time grain {time_grain}")

    while for_date < end_date:

        start_str = for_date.strftime("%Y-%m-%d %H:%M")
        end_str = (for_date + delta).strftime("%Y-%m-%d %H:%M")
        print(f"Running for time interval: {start_str} - {end_str}", "RUN")

        dbt_vars = {
            're_data:time_window_start': str(for_date),
            're_data:time_window_end': str(for_date + delta),
            're_data:anomaly_detection_window_start': str(for_date - timedelta(days=30))
        }

        run_list = ['dbt'] + ['run'] + ['--models'] + ['package:re_data'] + ['--vars'] + [json.dumps(dbt_vars)]
        if for_date == start_date and full_refresh:
            run_list.append('--full-refresh')
        
        add_dbt_flags(run_list, kwargs)

        completed_process = subprocess.run(run_list)
        completed_process.check_returncode()

        for_date += delta

        print(
            f"Running for date: {for_date.date()}",
            chalk.green("SUCCESS"),
        )


@click.group(help=f"Generate overview page for your re_data project")
def overview():
    pass


@click.group(help=f"Notification for various channels (email, slack, etc)")
def notify():
    pass


@overview.command()
@click.option(
    '--start-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str((date.today() - timedelta(days=7)).strftime("%Y-%m-%d")),
    help="Specify starting date to generate overview data, by default re_data will use 7 days ago for that value"
)
@click.option(
    '--end-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today().strftime("%Y-%m-%d")),
    help="""
        Specify end date to compute monitoring data, by default re_data will use today for that.
        And compute stats for last full data for that
    """
)
@click.option(
    '--interval',
    type=click.STRING,
    default='days:1',
    help="""
        Specify interval format. e.g. `days:1` for a time interval of 1 day
        or `hours:1` for a time interval of 1 hour
    """
)
@click.option(
    '--re-data-target-dir',
    type=click.STRING,
    help="""
        Which directory to store artefacts generated by re_data
        Defaults to the 'target-path' used in dbt_project.yml
    """
)
@add_options(dbt_flags)
@anonymous_tracking
def generate(start_date, end_date, interval, re_data_target_dir, **kwargs):
    start_date = str(start_date.date())
    end_date = str(end_date.date())
    dbt_target_path, re_data_target_path = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    overview_path = os.path.join(re_data_target_path, 'overview.json')

    args = {
        'start_date': start_date,
        'end_date': end_date,
        'interval': interval,
        'overview_path': overview_path
    }
    command_list = ['dbt', 'run-operation', 'generate_overview', '--args', yaml.dump(args)]
    add_dbt_flags(command_list, kwargs)
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    dbt_manifest_path = os.path.join(dbt_target_path, 'manifest.json')
    re_data_manifest = os.path.join(re_data_target_path, 'dbt_manifest.json')
    shutil.copyfile(dbt_manifest_path, re_data_manifest)

    target_file_path = os.path.join(re_data_target_path, 'index.html')
    shutil.copyfile(OVERVIEW_INDEX_FILE_PATH, target_file_path)

    print(
        f"Generating overview page", chalk.green("SUCCESS")
    )


@click.option(
    '--port',
    type=click.INT,
    default=8085,
    help="Specify the port number for the UI server. Default is 8085"
)
@click.option(
    '--re-data-target-dir',
    type=click.STRING,
    help="""
        Which directory to store artefacts generated by re_data
        Defaults to the 'target-path' used in dbt_project.yml
    """
)
@overview.command()
@anonymous_tracking
@add_options([dbt_project_dir_option])
def serve(port, re_data_target_dir, **kwargs):
    _, serve_dir = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    os.chdir(serve_dir)

    address = '0.0.0.0'

    httpd = TCPServer((address, port), SimpleHTTPRequestHandler)

    if True:
        try:
            webbrowser.open_new_tab(f'http://127.0.0.1:{port}/#/alerts')
        except webbrowser.Error:
            pass

    try:
        httpd.serve_forever()  # blocks
    finally:
        httpd.shutdown()
        httpd.server_close()


@notify.command()
@click.option(
    '--start-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str((date.today() - timedelta(days=7)).strftime("%Y-%m-%d")),
    help="Specify starting date to generate alert data, by default re_data will use 7 days ago for that value"
)
@click.option(
    '--end-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today().strftime("%Y-%m-%d")),
    help="""
        Specify end date used in generating alert data, by default re_data will use current date for that.
    """
)
@click.option(
    '--webhook-url',
    type=click.STRING,
    required=True,
    help="Incoming webhook url to post messages from external sources into Slack."
         " e.g. https://hooks.slack.com/services/T0JKJQKQS/B0JKJQKQS/XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
)
@click.option(
    '--subtitle',
    type=click.STRING,
    default='',
    help="Extra markdown text to be added to the alert message"
)
@click.option(
    '--re-data-target-dir',
    type=click.STRING,
    help="""
        Which directory to store artefacts generated by re_data
        Defaults to the 'target-path' used in dbt_project.yml
    """
)
@add_options(dbt_flags)
@anonymous_tracking
def slack(start_date, end_date, webhook_url, subtitle, re_data_target_dir, **kwargs):
    start_date = str(start_date.date())
    end_date = str(end_date.date())

    _, re_data_target_path = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    alerts_path = os.path.join(re_data_target_path, 'alerts.json')
    
    args = {
        'start_date': start_date,
        'end_date': end_date,
        'alerts_path': alerts_path,
    }

    command_list = ['dbt', 'run-operation', 'export_alerts', '--args', yaml.dump(args)]
    add_dbt_flags(command_list, kwargs)
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    with open(alerts_path) as f:
        alerts = json.load(f)
    if len(alerts) > 0:
        tabulated_alerts = format_alerts_to_table(alerts[:20])
        message = f"""
:red_circle: {len(alerts)} alerts found between {start_date} and {end_date}.
{subtitle}

_Showing most recent 20 alerts._
<https://docs.getre.io/latest/docs/reference/cli/overview|Generate Observability UI> to show more details.

```{tabulated_alerts}```
"""
    else:
        message = f""":white_check_mark: No alerts found between {start_date} and {end_date}.
{subtitle}"""
    slack_notify(webhook_url, message)
    print(
        f"Notification sent", chalk.green("SUCCESS")
    )


main.add_command(overview)
main.add_command(notify)
