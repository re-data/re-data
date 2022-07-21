from tabulate import tabulate
from typing import Any, Dict, Optional, List, Tuple
from datetime import datetime, timezone
from collections import defaultdict
import yaml
import json
import os
from dbt.config.project import Project
import pkg_resources
from click import BadOptionUsage


try:
    from yaml import (
        CSafeLoader as SafeLoader
    )
except ImportError:
    from yaml import ( 
        SafeLoader
    )
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

ALERT_TYPES = {'anomaly', 'schema_change', 'test'}

def get_project_root(kwargs):
    return os.getcwd() if not kwargs.get('project_dir') else os.path.abspath(kwargs['project_dir'])

def format_alerts_to_table(alerts: list, limit=None) -> str:
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
    if limit: 
        table = table[:limit]
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


def prepare_exported_alerts_per_model(alerts: list, members_per_model: Dict[str, Tuple[str, str]], selected_alert_types: set) -> dict:
    """
    Prepares alerts per model for slack message generation.
    """
    alerts_per_model = {}
    for alert in alerts:
        model = alert['model'].replace('"', '').replace('`', '')
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



def generate_slack_message(model, details, owners, subtitle: str, selected_alert_types: set) -> dict:
    """
    Generates a slack message for a given model.
    """
    anomalies = details['anomalies']
    schema_changes = details['schema_changes']
    tests = details['tests']
    slack_owners = [k[0] for k in owners]
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
                    "text": "Owners: {}".format(', '.join(slack_owners))
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
                        "text": ":warning: {} anomalies".format(len(anomalies)),
                        "emoji": True
                    },
                    {
                        "type": "plain_text",
                        "text": ":bulb: {} schema changes".format(len(schema_changes)),
                        "emoji": True
                    },
                    {
                        "type": "plain_text",
                        "text": ":bangbang: {} failed tests".format(len(tests)),
                        "emoji": True
                    }
                ]
            },
        ]
    }
    if anomalies and 'anomaly' in selected_alert_types:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Anomalies*\n ```{}```".format(format_alerts_to_table(anomalies, limit=10))
            }
        })
    if schema_changes and 'schema_change' in selected_alert_types:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Schema Changes*\n ```{}```".format(format_alerts_to_table(schema_changes, limit=10))
            }
        })
    if tests and 'test' in selected_alert_types:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Tests failures*\n ```{}```".format(format_alerts_to_table(tests, limit=10))
            }
        })
    if subtitle:
        message_obj['blocks'].append({
			"type": "section",
			"text": {
                "type": "mrkdwn",
                "text": subtitle
            }
		}
    )
    message_obj['blocks'].append({
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Generated at {}. Generate observability UI for more details".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
					"emoji": True
				}
			]
		}
    )

    return message_obj
    
    
def build_mime_message(
    mail_from: str,
    mail_to: str,
    subject: str,
    html_content: str,
    mime_subtype: str = 'mixed',
    mime_charset: str = 'utf-8'):
    """
    Build a MIME message that can be used to send an email and
    returns full list of recipients.

    :param mail_from: Email address to set as the email's from
    :param mail_to: Email address to set as the email's to
    :param subject: Subject of email
    :param html_content: HTML content of email
    :param mime_subtype: Can be used to specify the subtype of the message. Default = mixed
    :param mime_charset: Email's charset. Default = UTF-8.
    :return: Email as MIMEMultipart object
    """
    mime_msg = MIMEMultipart(mime_subtype)
    mime_msg['Subject'] = subject
    mime_msg['From'] = mail_from
    mime_msg['To'] = mail_to

    mime_text = MIMEText(html_content, 'html', mime_charset)
    mime_msg.attach(mime_text)

    return mime_msg

def send_mime_email(
        mime_msg: MIMEMultipart,
        mail_from: str,
        mail_to: str,
        smtp_host: str,
        smtp_port: int,
        smtp_user: str,
        smtp_password: str,
        use_ssl: bool = True
    ):
    """
    Send an email using the provided MIME message.

    :param mime_msg: MIME message to send
    :param mail_from: Email address to set as the email's from
    :param mail_to: Email address to set as the email's to
    :param smtp_host: SMTP server to use
    :param smtp_port: SMTP port to use
    :param smtp_user: SMTP user to use
    :param smtp_password: SMTP password to use
    :param use_ssl: Use SSL to connect to SMTP server
    """

    if use_ssl:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port)
    if smtp_user and smtp_password:
        server.login(smtp_user, smtp_password)
    server.sendmail(mail_from, mail_to, mime_msg.as_string())
    server.quit()

    
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

def validate_alert_types(selected_alert_types: List[str]):
    for alert_type in selected_alert_types:
        if alert_type not in ALERT_TYPES:
            raise BadOptionUsage("select", "%s not a valid alert type" % alert_type)