import re_data
from yachalk import chalk
import yaml
from yaml import SafeLoader
from functools import wraps
import os


def get_re_data_dbt_version(project_root):
    try:
        path = os.path.join(project_root, 'dbt_packages', 're_data', 'dbt_project.yml')
        
        with open(path, "r") as fh:
            project_path = yaml.load(fh, Loader=SafeLoader)
            return project_path['version']

    except Exception as e:
        print(chalk.yellow(
                ("You don't seem to have re_data dbt package installed.\n"
                "Please install it by adding to newest version from dbthub: https://hub.getdbt.com/re-data/re_data/latest\n\n")
        ))
 
        return None

def check_version(project_root):
    pypi_version = re_data.__version__
    dbt_version = get_re_data_dbt_version(project_root)

    if pypi_version != dbt_version:
        print(chalk.yellow(
            (f"WARNING: re-data version mismatch, python package version: {pypi_version} != dbt package version: {dbt_version}\n"
             "Please update your packages to the same versions.\n")
        ))

def with_version_check(fun):

    @wraps(fun)
    def decorated(*args, **kwargs):
        project_root = re_data.utils.get_project_root(kwargs)
        check_version(project_root)
        return fun(*args, **kwargs)
    return decorated