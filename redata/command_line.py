import click
import subprocess
import json


@click.group(help=f"Redata CLI")
def main():
    pass


@main.command()
@click.argument('dbt_args', nargs=-1)
def dbt(dbt_args):
    subprocess.run(['dbt'] + [arg for arg in dbt_args])

@main.command()
@click.argument('days_back_start', type=click.INT)
@click.argument('days_back_end', type=click.INT)
def backfill(days_back_start, days_back_end):

    for day_back in range(days_back_start, days_back_end - 1, -1):
        dbt_vars = {
            'redata:days_back': day_back
        }

        subprocess.run(['dbt'] + ['run'] + ['--vars'] + [json.dumps(dbt_vars)])