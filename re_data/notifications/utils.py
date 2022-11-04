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
                'owners': members_per_model.get(model) or ['allUsers', 'allGroups'],
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


def create_owners_to_models_map(monitored_models: List) -> Dict[str, List[str]]:
    model_with_no_owner_key = 'NO_OWNER'
    owner_mapping = defaultdict(list) 
    for monitored_model in monitored_models:
        model = monitored_model['model'].replace('"', '').replace('`', '')
        model_owners = json.loads(monitored_model.get('owners')) or {}

        has_email_owner = False
        for email, notify_details in model_owners.items():
            if notify_details.get('notify_channel') == 'email':
                has_email_owner = True
                owner_mapping[email].append(model)
        # if model has no owner with an email notification channel, treat the model as having no owner
        if not has_email_owner:
            owner_mapping[model_with_no_owner_key].append(model)

    return owner_mapping

def create_models_to_alerts_map(alerts: List, selected_alert_types) -> Dict[str, List[str]]:
    alerts_per_model = {}
    for alert in alerts:
        model = alert['model'].replace('"', '').replace('`', '') if alert['model'] else 'No specific model'
        if model not in alerts_per_model:
            alerts_per_model[model] = {
                'anomalies': [],
                'schema_changes': [],
                'tests': [],
            }
        if alert['type'] == 'anomaly' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['anomalies'].append(alert)
        elif alert['type'] == 'schema_change' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['schema_changes'].append(alert)
        elif alert['type'] == 'test' and alert['type'] in selected_alert_types:
            alerts_per_model[model]['tests'].append(alert)
    return alerts_per_model