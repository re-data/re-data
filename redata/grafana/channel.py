from redata import settings


def get_slack_notification_channel():
    return {
        "disableResolveMessage": False,
        "id": -1,
        "frequency": "15m",
        "name": "Slack notification",
        "type": "slack",
        "isDefault": True,
        "sendReminder": True,
        "secureFields": {},
        "secureSettings": {"url": settings.REDATA_SLACK_NOTIFICATION_URL},
        "settings": {
            "autoResolve": True,
            "uploadImage": False,
            "httpMethod": "POST",
            "severity": "critical",
        },
    }
