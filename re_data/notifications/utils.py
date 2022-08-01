from typing import Dict, Tuple, List
from collections import defaultdict
import json
from click import BadOptionUsage

ALERT_TYPES = {'anomaly', 'schema_change', 'test'}

def build_notification_identifiers_per_model(monitored_list: list, channel) -> Dict[str, Tuple[str, str]]:
    """
    Builds a list of identifiers per model to notify.
    params:
        monitored_list: list
            List of models to monitor.
    return: dict
        Dictionary with model as key and list of identifiers as value.
    """
    obj = defaultdict(list)
    for monitored in monitored_list:
        model = monitored['model'].replace('"', '').replace('`', '')
        members = json.loads(monitored.get('owners')) or {}
        for identifier, details in members.items():
            notify_channel = details.get('notify_channel')
            group_name = details.get('owner')
            if notify_channel == channel:
                if notify_channel == 'slack':
                    slack_mention = '<@{}>'.format(identifier)
                    obj[model].append((slack_mention, group_name))
                elif notify_channel == 'email':
                    obj[model].append((identifier, group_name))
    return obj

def prepare_exported_alerts_per_model(alerts: list, members_per_model: Dict[str, Tuple[str, str]], selected_alert_types: set) -> dict:
    """
    Prepares alerts per model for slack message generation.
    """
    alerts_per_model = {}
    for alert in alerts:
        model = alert['model'].replace('"', '').replace('`', '') if alert['model'] else 'No specific model'
        if model not in alerts_per_model:
            alerts_per_model[model] = {
                'anomalies': [],
                'schema_changes': [],
                'tests': [],
                'owners': [k[0] for k in members_per_model.get(model, [])] or ['allUsers', 'allGroups'],
            }
        if alert['type'] == 'anomaly' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['anomalies'].append(alert)
        elif alert['type'] == 'schema_change' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['schema_changes'].append(alert)
        elif alert['type'] == 'test' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['tests'].append(alert)
    return alerts_per_model


def validate_alert_types(selected_alert_types: List[str]):
    for alert_type in selected_alert_types:
        if alert_type not in ALERT_TYPES:
            raise BadOptionUsage("select", "%s not a valid alert type" % alert_type)