import json
from redata import settings
from redata.grafana.utils import load_json_data, update_home_panel_element
from grafana_api.grafana_face import GrafanaFace
from redata.grafana.panels.base import HomeLastDayTraffic, HomeLastModifiedTime
import math

def load_json_data(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    
    return data


def generate_overrides(dashboards):
    override_list = []
    for dashboard in dashboards:

        override = load_json_data(settings.HOME_OVERRIDES_LOCATION)
        override['clickThrough'] = dashboard['dashboard']['url']
        override['metricName'] = dashboard['table'].table_name
        override['label'] = dashboard['table'].table_name
        
        override_list.append(
            override
        )
    
    return override_list

def get_best_column_count(dashboards_num):
    if dashboards_num <= 10:
        return dashboards_num
    
    return int(math.sqrt(dashboards_num * 4))


def create_home_dashboard(grafana_api, dashboards):
    home_data = load_json_data(settings.HOME_DASHBOARD_LOCATION)

    panels = home_data['panels']
    
    for panel in panels:
        if panel['title'] in ['new_records_created (in last 24h)', 'time_since_last_record_created']:
            panel['savedOverrides'] = generate_overrides(dashboards)

            # native polystat logic for column/row auto scalling works strange
            panel['polystat']['columns'] = get_best_column_count(len(dashboards))
        
        if panel['title'] == 'new_records_created (in last 24h)':
            update_home_panel_element(panel, HomeLastDayTraffic)
            
        if panel['title'] == 'time_since_last_record_created':
            update_home_panel_element(panel, HomeLastModifiedTime)
            

    response = grafana_api.dashboard.update_dashboard(
        dashboard={
            'dashboard': home_data,
            'folderID': 0,
            'overwrite': True
        }
    )
    print (f"Dashboard for home generated:", response)
    return response

