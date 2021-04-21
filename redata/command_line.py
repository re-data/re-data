import click
import subprocess


@click.group(help=f"Redata CLI")
def main():
    pass


@main.command()
@click.argument('dbt_args', nargs=-1)
def dbt(dbt_args):
    subprocess.run(['dbt'] + [arg for arg in dbt_args])