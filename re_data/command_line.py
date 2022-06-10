from email.policy import default
import click
import subprocess
import json
from datetime import date, timedelta, datetime
import shutil
import logging

import os
from re_data.templating import render
from re_data.include import OVERVIEW_INDEX_FILE_PATH
from http.server import SimpleHTTPRequestHandler
import webbrowser
from socketserver import TCPServer
from re_data.version import check_version, with_version_check
from yachalk import chalk
import yaml
from re_data.notifications.slack import slack_notify
from re_data.utils import build_mime_message, parse_dbt_vars, prepare_exported_alerts_per_model, \
    generate_slack_message, build_notification_identifiers_per_model, send_mime_email, load_metadata_from_project, normalize_re_data_json_export, \
        ALERT_TYPES, validate_alert_types, get_project_root

from dbt.config.project import Project
from re_data.tracking import anonymous_tracking
from re_data.config.utils import read_re_data_config
from re_data.config.validate import validate_config_section

logger = logging.getLogger(__name__)


def add_options(options):
    def _add_options(func):
        for option in reversed(options):
            func = option(func)
        return func
    return _add_options

def add_dbt_flags(command_list, flags):
    for key, value in flags.items():
        # exclude the --dbt-vars flag, as it's not a valid dbt flag
        if value and key != 'dbt_vars':
            key = key.replace('_', '-')
            command_list.extend([f'--{key}', value])
    print(' '.join(command_list))

def get_target_paths(kwargs, re_data_target_dir=None):
    project_root = get_project_root(kwargs)
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
dbt_vars_option = click.option(
    '--dbt-vars',
    type=click.STRING,
    help="""
        Supply variables to the project. This argument
        overrides variables defined in your dbt_project.yml
        file. This argument should be a YAML string, eg.
        {my_var: my_val}'
    """
)
dbt_flags = [
    dbt_profile_option,
    dbt_target_option,
    dbt_project_dir_option,
    dbt_profiles_dir_option,
    dbt_vars_option
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

    dbt_vars = parse_dbt_vars(kwargs.get('dbt_vars'))
    run_list = ['dbt', 'run', '--models', 're_data_columns', 're_data_monitored']
    if dbt_vars: run_list.extend(['--vars', yaml.dump(dbt_vars)])
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
    dbt_vars = parse_dbt_vars(kwargs.get('dbt_vars'))

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

        re_data_dbt_vars = {
            're_data:time_window_start': str(for_date),
            're_data:time_window_end': str(for_date + delta)
        }
        dbt_vars.update(re_data_dbt_vars)

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
@with_version_check
def generate(start_date, end_date, interval, re_data_target_dir, **kwargs):
    start_date = str(start_date.date())
    end_date = str(end_date.date())
    dbt_target_path, re_data_target_path = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    overview_path = os.path.join(re_data_target_path, 'overview.json')
    metadata_path = os.path.join(re_data_target_path, 'metadata.json')
    tests_history_path = os.path.join(re_data_target_path, 'tests_history.json')
    table_samples_path = os.path.join(re_data_target_path, 'table_samples.json')
    dbt_vars = parse_dbt_vars(kwargs.get('dbt_vars'))
    metadata = load_metadata_from_project(start_date, end_date, interval, kwargs)
    monitored_path = os.path.join(re_data_target_path, 'monitored.json')

    args = {
        'start_date': start_date,
        'end_date': end_date,
        'interval': interval,
        'overview_path': overview_path,
        'monitored_path': monitored_path,
    }
    command_list = ['dbt', 'run-operation', 'generate_overview', '--args', yaml.dump(args)]
    if dbt_vars: command_list.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(command_list, kwargs)
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    # export tests history
    tests_history_args = {
        'start_date': start_date,
        'end_date': end_date,
        'tests_history_path': tests_history_path
    }
    tests_history_command_list = ['dbt', 'run-operation', 'export_tests_history', '--args', yaml.dump(tests_history_args)]
    if dbt_vars: tests_history_command_list.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(tests_history_command_list, kwargs)
    th_completed_process = subprocess.run(tests_history_command_list)
    th_completed_process.check_returncode()

    # export table samples
    table_samples_args = {
        'start_date': start_date,
        'end_date': end_date,
        'table_samples_path': table_samples_path
    }
    table_samples_command_list = ['dbt', 'run-operation', 'export_table_samples', '--args', yaml.dump(table_samples_args)]
    if dbt_vars: table_samples_command_list.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(table_samples_command_list, kwargs)
    ts_completed_process = subprocess.run(table_samples_command_list)
    ts_completed_process.check_returncode()

    # write metadata to re_data target path
    with open(metadata_path, 'w+', encoding='utf-8') as f:
        json.dump(metadata, f)

    # run dbt docs generate to generate the a full manifest that contains compiled_path etc
    dbt_docs = ['dbt', 'docs', 'generate']
    if dbt_vars: dbt_docs.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(dbt_docs, kwargs)
    dbt_docs_process = subprocess.run(dbt_docs)
    dbt_docs_process.check_returncode()


    dbt_manifest_path = os.path.join(dbt_target_path, 'manifest.json')
    re_data_manifest = os.path.join(re_data_target_path, 'dbt_manifest.json')
    shutil.copyfile(dbt_manifest_path, re_data_manifest)

    target_file_path = os.path.join(re_data_target_path, 'index.html')
    shutil.copyfile(OVERVIEW_INDEX_FILE_PATH, target_file_path)

    normalize_re_data_json_export(overview_path)
    normalize_re_data_json_export(tests_history_path)
    normalize_re_data_json_export(table_samples_path)

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
@click.option(
    "--no-browser",
    is_flag=True,
)
@overview.command()
@anonymous_tracking
@add_options([dbt_project_dir_option])
def serve(port, re_data_target_dir, no_browser, **kwargs):
    _, serve_dir = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    os.chdir(serve_dir)

    address = '0.0.0.0'

    httpd = TCPServer((address, port), SimpleHTTPRequestHandler)

    if not no_browser:
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
    required=False,
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
@click.option(
    '--select',
    multiple=True,
    default=ALERT_TYPES,
    help="""
        Specfy which alert types to generate. This accepts multiple options
        e.g. --select anomaly --select schema_change
    """)
@add_options(dbt_flags)
@anonymous_tracking
@with_version_check
def slack(start_date, end_date, webhook_url, subtitle, re_data_target_dir, select, **kwargs):
    validate_alert_types(selected_alert_types=select)
    start_date = str(start_date.date())
    end_date = str(end_date.date())
    selected_alert_types = set(select)

    if not webhook_url: # if webhook_url is via arguments, check the config file
        config = read_re_data_config()
        validate_config_section(config, 'slack')
        slack_config = config.get('notifications').get('slack')
        webhook_url = slack_config.get('webhook_url')

    _, re_data_target_path = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    alerts_path = os.path.join(re_data_target_path, 'alerts.json')
    monitored_path = os.path.join(re_data_target_path, 'monitored.json')
    dbt_vars = parse_dbt_vars(kwargs.get('dbt_vars'))
    
    args = {
        'start_date': start_date,
        'end_date': end_date,
        'alerts_path': alerts_path,
        'monitored_path': monitored_path,
    }

    command_list = ['dbt', 'run-operation', 'export_alerts', '--args', yaml.dump(args)]
    if dbt_vars: command_list.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(command_list, kwargs)
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    normalize_re_data_json_export(alerts_path)
    normalize_re_data_json_export(monitored_path)

    with open(alerts_path) as f:
        alerts = json.load(f)
    with open(monitored_path) as f:
        monitored = json.load(f)

    slack_members = build_notification_identifiers_per_model(monitored_list=monitored, channel='slack')

    alerts_per_model = prepare_exported_alerts_per_model(alerts=alerts, members_per_model=slack_members, selected_alert_types=selected_alert_types)
    for model, details in alerts_per_model.items():
        owners = slack_members.get(model, [])
        slack_message = generate_slack_message(model, details, owners, subtitle, selected_alert_types)
        slack_notify(webhook_url, slack_message)
    print(
        f"Notification sent", chalk.green("SUCCESS")
    )

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
    '--re-data-target-dir',
    type=click.STRING,
    help="""
        Which directory to store artefacts generated by re_data
        Defaults to the 'target-path' used in dbt_project.yml
    """
)
@click.option(
    '--select',
    multiple=True,
    default=ALERT_TYPES,
    help="""
        Specfy which alert types to generate. This accepts multiple options
        e.g. --select anomaly --select schema_change
    """)
@add_options(dbt_flags)
@anonymous_tracking
@with_version_check
def email(start_date, end_date, re_data_target_dir, select, **kwargs):
    validate_alert_types(selected_alert_types=select)
    selected_alert_types = set(select)
    config = read_re_data_config()
    validate_config_section(config, 'email')
    email_config = config.get('notifications').get('email')
    start_date = str(start_date.date())
    end_date = str(end_date.date())

    mail_from = email_config.get('mail_from')
    smtp_host = email_config.get('smtp_host')
    smtp_port = email_config.get('smtp_port')
    smtp_user = email_config.get('smtp_user')
    smtp_password = email_config.get('smtp_password')
    use_ssl = email_config.get('use_ssl', False)

    _, re_data_target_path = get_target_paths(kwargs=kwargs, re_data_target_dir=re_data_target_dir)
    alerts_path = os.path.join(re_data_target_path, 'alerts.json')
    monitored_path = os.path.join(re_data_target_path, 'monitored.json')
    dbt_vars = parse_dbt_vars(kwargs.get('dbt_vars'))
    
    args = {
        'start_date': start_date,
        'end_date': end_date,
        'alerts_path': alerts_path,
        'monitored_path': monitored_path,
    }
    

    command_list = ['dbt', 'run-operation', 'export_alerts', '--args', yaml.dump(args)]
    if dbt_vars: command_list.extend(['--vars', yaml.dump(dbt_vars)])
    add_dbt_flags(command_list, kwargs)
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    with open(alerts_path) as f:
        alerts = json.load(f)
    with open(monitored_path) as f:
        monitored = json.load(f)

    email_members = build_notification_identifiers_per_model(monitored_list=monitored, channel='email')
    alerts_per_model = prepare_exported_alerts_per_model(alerts=alerts, members_per_model=email_members, selected_alert_types=selected_alert_types)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for model in alerts_per_model:
        owners = email_members.get(model, [])
        for mail_to, group_name in owners:
            mime_msg = build_mime_message(
                mail_from=mail_from,
                mail_to=mail_to,
                subject='ReData Alerts [{}]'.format(current_time),
                html_content=render.render_email_alert(alerts=alerts_per_model, owner=mail_to, group_name=group_name),
            )

            send_mime_email(
                mime_msg=mime_msg,
                mail_from=mail_from,
                mail_to=mail_to,
                smtp_host=smtp_host,
                smtp_port=smtp_port,
                smtp_user=smtp_user,
                smtp_password=smtp_password,
                use_ssl=use_ssl,
            )
    
    print(
        f"Notification sent", chalk.green("SUCCESS")
    )


main.add_command(overview)
main.add_command(notify)
