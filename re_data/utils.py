from typing import Any, Dict, Optional, List, Tuple
from datetime import datetime, timezone
import json
import os
from dbt.config.project import Project
import pkg_resources
import yaml
try:
    from yaml import (
        CSafeLoader as SafeLoader
    )
except ImportError:
    from yaml import ( 
        SafeLoader
    )


def get_project_root(kwargs):
    return os.getcwd() if not kwargs.get('project_dir') else os.path.abspath(kwargs['project_dir'])

def load_metadata_from_project(start_date, end_date, interval, kwargs) -> Dict:
    project_root = os.getcwd() if not kwargs.get('project_dir') else os.path.abspath(kwargs['project_dir'])
    partial = Project.partial_load(project_root)
    version = pkg_resources.require("re_data")[0].version
    metadata = {
        'project_dict': partial.project_dict,
        'packages': partial.packages_dict,
        'version': version,
        'generated_at': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
        're_data_args': {
            'start_date': start_date,
            'end_date': end_date,
            'interval': interval
        }
    }
    return metadata

def normalize_re_data_json_export(path: str):
    """
    Normalize the data exported from Re.
    """
    with open(path, 'r') as f:
        json_data = json.load(f)
    
    normalized_json_data = [{k.lower(): v for k, v in data.items()} for data in json_data]

    # overwrite the original file with the normalized data
    with open(path, 'w+', encoding='utf-8') as f:
        json.dump(normalized_json_data, f)

def parse_dbt_vars(dbt_vars_string) -> Dict[str, Any]:
    dbt_vars = {}
    if dbt_vars_string:
        dbt_vars = safe_load(dbt_vars_string)
        content_type = type(dbt_vars)
        if content_type is not dict:
            raise ValueError('The --dbt-vars argument expected a yaml dictionary, but got {}'.format(content_type.__name__))
    return dbt_vars

def safe_load(content) -> Optional[Dict[str, Any]]:
    return yaml.load(content, Loader=SafeLoader)
