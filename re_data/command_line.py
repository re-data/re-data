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

@click.group(help=f"re_data CLI")
def main():
    pass


@main.command()
@click.argument(
    'project_name'
)
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
def detect():
    print(f"Detecting tables", "RUN")

    run_list = ['dbt', 'run', '--models', 're_data_tables', 're_data_columns']
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
def run(start_date, end_date, interval, full_refresh):
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
def generate(start_date, end_date, interval):
    start_date = str(start_date.date())
    end_date = str(end_date.date())
    args = {
        'start_date': start_date,
        'end_date': end_date,
        'interval': interval
    }
    command_list = ['dbt', 'run-operation', 'generate_overview', '--args', yaml.dump(args)]
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    dbt_manifest_path = os.path.join(os.getcwd(), 'target', 'manifest.json')
    re_data_manifest = os.path.join(os.getcwd(), 'target', 're_data', 'dbt_manifest.json')
    command_list = ['cp', dbt_manifest_path, re_data_manifest]
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()

    # todo: get target_path from dbt_project.yml
    target_file_path = os.path.join(os.getcwd(), 'target', 're_data', 'index.html')
    shutil.copyfile(OVERVIEW_INDEX_FILE_PATH, target_file_path)

    print(
            f"Generating overview page", chalk.green("SUCCESS")
    )


@overview.command()
def serve():
    serve_dir = os.path.join(os.getcwd(), 'target', 're_data')
    os.chdir(serve_dir)

    port = 8085
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


main.add_command(overview)
