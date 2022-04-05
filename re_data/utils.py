from tabulate import tabulate
from typing import Any, Dict, Optional, Iterable, List, Union
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
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib


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

def build_notification_identifiers_per_model(monitored_list: list, channel) -> dict:
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
        model = monitored['model'].replace('"', '')
        members = json.loads(monitored.get('owners')) or {}
        for identifier, details in members.items():
            notify_channel = details.get('notify_channel')
            if notify_channel == channel:
                if notify_channel == 'slack':
                    slack_mention = '<@{}>'.format(identifier)
                    obj[model].append(slack_mention)
                elif notify_channel == 'email':
                    obj[model].append(identifier)
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
                        "text": ":bangbang: x failed tests",
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
    
def generate_html_content_for_email(details):
    """
    Generates the HTML content for the email.
    """

    anomalies = details.get('anomalies') or []
    schema_changes = details.get('schema_changes') or []
    return """
    <html>
        <head>
            <title>ReData Alerts</title>
        </head>
        <body>
            <h1>ReData Alerts</h1>
            <p>
                <b>Anomalies:</b>
                <br>
                <br>
                <table>
                    <tr>
                        <th>Model</th>
                        <th>Time Window</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>test_model</td>
                        <td>2018-01-01 00:00:00 - 2018-01-01 00:00:00</td>
                        <td>0.0</td>
                    </tr>
                </table>
            </p>
            <p>
                <b>Schema Changes:</b>
                <br>
                <br>
                <table>
                    <tr>
                        <th>Model</th>
                        <th>Time Window</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>test_model</td>
                        <td>2018-01-01 00:00:00 - 2018-01-01 00:00:00</td>
                        <td>0.0</td>
                    </tr>
                </table>
            </p>
        </body>
    </html>
    """

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
        smtp_password: str
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
    """
    smtp_host = smtp_host or 'localhost'
    smtp_port = smtp_port or 25
    smtp_user = smtp_user or None
    smtp_password = smtp_password or None

    s = smtplib.SMTP_SSL(smtp_host, smtp_port)
    if smtp_user and smtp_password:
        s.login(smtp_user, smtp_password)
    s.sendmail(mail_from, mail_to, mime_msg.as_string())
    s.quit()
