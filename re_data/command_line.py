import click
import subprocess
import json
from datetime import date, timedelta
from dbt.ui import green, red
from dbt.task.printer import print_fancy_output_line
import shutil
import os
from re_data.templating import render
from re_data.include import OVERVIEW_INDEX_FILE_PATH
from http.server import SimpleHTTPRequestHandler
import webbrowser
from socketserver import TCPServer

@click.group(help=f"re_data CLI")
def main():
    pass


@main.command()
@click.argument(
    'project_name'
)
def init(project_name):
    print_fancy_output_line(f"Creating {project_name} template project", "RUN", print, None, None)
    dir_path = os.path.dirname(os.path.realpath(__file__))
    shutil.copytree(os.path.join(dir_path, 'dbt_template'), project_name)

    with open(f"{project_name}/dbt_project.yml", "w") as f:
        f.write(render.render_dbt_project(project_name))

    bash_command = f'cd {project_name} && dbt deps'
    response = os.system(bash_command)

    if not response:
        info = green("SUCCESS")
    else:
        info = red("FAILURE")

    print_fancy_output_line(f"Creating {project_name} template project", info, print, None, None)

    if not response:
        print_fancy_output_line(f"Setup profile & re_data:schemas var in dbt_project.yml", "INFO", print, None, None)


@main.command()
def detect():
    print_fancy_output_line(f"Detecting tables", "RUN", print, None, None)

    run_list = ['dbt', 'run', '--models', 're_data_tables', 're_data_columns']
    completed_process = subprocess.run(run_list)
    completed_process.check_returncode()

    print_fancy_output_line(f"Detecting tables", "SUCCESS", print, None, None)


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
    '--full-refresh',
    is_flag=True,
    help='Warning! If specified re_data runs first dbt run with --full-refresh option cleaning all previously gathered profiling information'
)
def run(start_date, end_date, full_refresh):
    for_date = start_date
    total_days = (end_date - start_date).days

    while for_date < end_date:

        day_num = (for_date - start_date).days + 1

        print_fancy_output_line(f"Running for date: {for_date.date()}", "RUN", print, day_num, total_days)

        days_back = (date.today() - for_date.date()).days - 1

        dbt_vars = {
            're_data:time_window_start': str(for_date),
            're_data:time_window_end': str(for_date + timedelta(days=1)),
            're_data:anomaly_detection_window_start': str(for_date - timedelta(days=30))
        }

        run_list = ['dbt'] + ['run'] + ['--models'] + ['package:re_data'] + ['--vars'] + [json.dumps(dbt_vars)]
        if for_date == start_date and full_refresh:
            run_list.append('--full-refresh')

        completed_process = subprocess.run(run_list)
        completed_process.check_returncode()

        for_date += timedelta(days=1)

        print_fancy_output_line(
            f"Running for date: {for_date.date()}",
            green("SUCCESS"),
            print,
            day_num,
            total_days
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
    start_date = str(start_date)
    end_date = str(end_date)
    import yaml
    args = {
        'start_date': start_date,
        'end_date': end_date,
        'interval': interval
    }
    command_list = ['dbt', 'run-operation', 'generate_overview', '--args', yaml.dump(args)]
    completed_process = subprocess.run(command_list)
    completed_process.check_returncode()
    # todo: get target_path from dbt_project.yml
    target_file_path = os.path.join(os.getcwd(), 'target', 're_data', 'index.html')
    shutil.copyfile(OVERVIEW_INDEX_FILE_PATH, target_file_path)

@overview.command()
def serve():
    serve_dir = os.path.join(os.getcwd(), 'target', 're_data')
    os.chdir(serve_dir)

    port = 8085
    address = '0.0.0.0'
    
    httpd = TCPServer((address, port), SimpleHTTPRequestHandler) 

    if True:
        try:
            webbrowser.open_new_tab(f'http://127.0.0.1:{port}')
        except webbrowser.Error:
            pass

    try:
        httpd.serve_forever()  # blocks
    finally:
        httpd.shutdown()
        httpd.server_close()


main.add_command(overview)
