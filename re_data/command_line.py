import click
import subprocess
import json
from datetime import date, timedelta
from dbt.ui import green, red
from dbt.task.printer import print_fancy_output_line
import shutil
import os

@click.group(help=f"Redata CLI")
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
@click.option(
    '--start-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today() - timedelta(days=1)),
    help="Specify starting date to compute monitoring data, by default redata will use yesterday for that value"
)
@click.option(
    '--end-date',
    type=click.DateTime(formats=["%Y-%m-%d"]),
    default=str(date.today()),
    help="""
        Specify end date to compute monitoring data, by default redata will use today for that.
        And compute stats for last full data for that
    """
)
@click.option(
    '--full-refresh',
    is_flag=True,
    help='If specifed redata runs first dbt run with --full-refresh option cleaning all previously gathered profiling information'
)
def run(start_date, end_date, full_refresh):

    for_date = start_date
    while for_date < end_date:

        days_back = (date.today() - for_date.date()).days - 1

        dbt_vars = {
            're_data:time_window_start': str(for_date),
            're_data:time_window_end': str(for_date + timedelta(days=1)),
            're_data:anomaly_detection_window_start': str(for_date - timedelta(days=30))
        }

        run_list = ['dbt'] + ['run'] + ['--vars'] + [json.dumps(dbt_vars)]
        if for_date == start_date and full_refresh:
            run_list.append('--full-refresh')

        subprocess.run(run_list)

        for_date += timedelta(days=1)