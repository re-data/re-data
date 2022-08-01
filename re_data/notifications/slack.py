from re import sub
from tabulate import tabulate
import requests
from typing import Any, Dict, Optional, List, Tuple
from datetime import datetime


def slack_notify(webhook_url: str, body: dict) -> None:
    """
    Send a message to a slack webhook
    :param webhook_url: str
        Slack incoming webhook url e.g https://hooks.slack.com/services/T0JKJQKQS/B0JKJQKQS/XXXXXXXXXXXXXXXXXXXXXXXXXXXX
    :param body: dict
        Slack message payload
    :return: None
    """
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.post(webhook_url, json=body, headers=headers)
    response.raise_for_status()

def format_alerts(alerts: list, limit=None) -> str:
    """
    Formats a list of alerts to a table.
    :param alerts:
        List of alerts exported from dbt-re-data.
    :return: str
        Formatted table.
    """
    table = []
    for alert in alerts:
        time = datetime.strptime(alert.get('time_window_end'), "%Y-%m-%d %H:%M:%S")
        time_formatted = time.strftime("%Y-%m-%d %H:%M")

        table.append(
            f"[{time_formatted}] {alert['message']}",
        )
    if limit: 
        table = table[:limit]

    return "\n".join(table)


def add_footer(message_obj, subtitle):
    """
    Adds a footer to a slack message.
    """
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
                "text": "Generated at {}. Check re_data UI for more details".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                "emoji": True
            }
        ]
    })
    
    return message_obj

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
                    "text": "Table: {}".format(model),
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
                "text": "*Anomalies*\n ```{}```".format(format_alerts(anomalies, limit=10))
            }
        })
    if schema_changes and 'schema_change' in selected_alert_types:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Schema Changes*\n ```{}```".format(format_alerts(schema_changes, limit=10))
            }
        })
    if tests and 'test' in selected_alert_types:
        message_obj['blocks'].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Tests failures*\n ```{}```".format(format_alerts(tests, limit=10))
            }
        })

    add_footer(message_obj, subtitle)

    return message_obj
    
    

def generate_all_good_slack_message(subtitle: str) -> dict:
    """
    Generates a slack message for a given model.
    """
    message_obj = {
        'blocks': [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "All Good! :tada:",
                    "emoji": True
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "re_data didn't found any alerts at the moment",
                    "emoji": True
                }
            },
        ]
    }

    add_footer(message_obj, subtitle)

    return message_obj