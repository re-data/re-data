from tabulate import tabulate
from typing import Any, Dict, Optional
from datetime import datetime
from collections import defaultdict
import yaml
import json
try:
    from yaml import (
        CSafeLoader as SafeLoader
    )
except ImportError:
    from yaml import ( 
        SafeLoader
    )


def format_alerts_to_table(alerts: list) -> str:
    """
    Formats a list of alerts to a table.
    :param alerts:
        List of alerts exported from dbt-re-data.
    :return: str
        Formatted table.
    """
    table = []
    for alert in alerts:
        table.append([
            # alert['model'],
            alert['message'],
            alert['value'],
            alert['time_window_end'],
        ])
    return tabulate(table, headers=['Message', 'Value', 'Time Window'], tablefmt='orgtbl')

def safe_load(content) -> Optional[Dict[str, Any]]:
    return yaml.load(content, Loader=SafeLoader)

def parse_dbt_vars(dbt_vars_string) -> Dict[str, Any]:
    dbt_vars = {}
    if dbt_vars_string:
        dbt_vars = safe_load(dbt_vars_string)
        content_type = type(dbt_vars)
        if content_type is not dict:
            raise ValueError('The --dbt-vars argument expected a yaml dictionary, but got {}'.format(content_type.__name__))
    return dbt_vars


def prepare_exported_alerts_per_model(alerts: list) -> dict:
    """
    Prepares alerts per model for slack message generation.
    """
    alerts_per_model = {}
    for alert in alerts:
        model = alert['model'].replace('"', '')
        if model not in alerts_per_model:
            alerts_per_model[model] = {
                'anomalies': [],
                'schema_changes': [],
            }
        if alert['type'] == 'anomaly':
            alerts_per_model[model]['anomalies'].append(alert)
        elif alert['type'] == 'schema_change':
            alerts_per_model[model]['schema_changes'].append(alert)
    return alerts_per_model

def prepare_slack_member_ids_per_model(monitored_list: list) -> dict:
    """
    Prepares slack member ids per model for slack message generation.
    params:
        monitored_list: list
            List of models to monitor.
    return: dict
        Slack member ids per model.
    """
    obj = defaultdict(list)
    for monitored in monitored_list:
        model = monitored['model'].replace('"', '')
        members = json.loads(monitored.get('owners')) or {}
        for identifier, details in members.items():
            if details.get('notify_channel') == 'slack':
                slack_mention = '<@{}>'.format(identifier)
                obj[model].append(slack_mention)
    return obj



def generate_slack_message(model, details, owners) -> dict:
    """
    Generates a slack message for a given model.
    """
    anomalies = details['anomalies']
    schema_changes = details['schema_changes']
    message_obj = {
        'blocks': [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Model: {}".format(model),
                    "emoji": True
			    }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Owners: {}".format(', '.join(owners))
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "plain_text",
                        "text": ":red_circle: {} anomalies".format(len(anomalies)),
                        "emoji": True
                    },
                    {
                        "type": "plain_text",
                        "text": ":large_yellow_circle: {} schema changes".format(len(schema_changes)),
                        "emoji": True
                    },
                    {
                        "type": "plain_text",
                        "text": ":test_tube: x failed tests",
                        "emoji": True
                    }
                ]
            },
        ]
    }
    if anomalies:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Anomalies*\n ```{}```".format(format_alerts_to_table(anomalies))
            }
        })
    if schema_changes:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Schema Changes*\n ```{}```".format(format_alerts_to_table(schema_changes))
            }
        })
    message_obj['blocks'].append({
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Generated at {}".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
					"emoji": True
				}
			]
		}
    )
    return message_obj