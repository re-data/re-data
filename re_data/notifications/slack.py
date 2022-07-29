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

def format_alerts(alerts: list, alert_type,limit=None) -> str:
    """
    Formats a list of alerts to a table.
    :param alerts:
        List of alerts exported from dbt-re-data.
    :return: str
        Formatted table.
    """
    elements = []
    for alert in alerts:
        time = datetime.strptime(alert.get('time_window_end'), "%Y-%m-%d %H:%M:%S")
        time_formatted = time.strftime("%Y-%m-%d %H:%M")
        elements.extend([
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*message*: {alert.get('message')}",
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*time*: {time_formatted}"
                    }
                ]
            }])
    if elements:
        elements.insert(0, {
            'type': 'header',
            'text': {
                'type': 'plain_text',
                'text': f'{alert_type}',
            }
        })

    return elements


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
    message_obj['blocks'].extend(format_alerts(anomalies, "Anomalies", limit=10))
    message_obj['blocks'].extend(format_alerts(schema_changes, "Schema Changes", limit=10))
    message_obj['blocks'].extend(format_alerts(tests, "Tests", limit=10))

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
		}
    )

    return message_obj
    
    