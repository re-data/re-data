import requests


def slack_notify(webhook_url: str, message: str) -> None:
    """
    Send a message to a slack webhook
    :param webhook_url: str
        Slack incoming webhook url e.g https://hooks.slack.com/services/T0JKJQKQS/B0JKJQKQS/XXXXXXXXXXXXXXXXXXXXXXXXXXXX
    :param message: str
        Message to send to slack
    :return: None
    """
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'text': message
    }

    response = requests.post(webhook_url, json=data, headers=headers)
    response.raise_for_status()
