from jsonschema import validate

EMAIL_CONFIG_SCHEMA = {
    "type" : "object",
    "required": ['mail_from', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password'],
    "properties" : {
        "mail_from" : {"type" : "string"},
        "smtp_host" : {"type" : "string"},
        "smtp_port" : {"type" : "number"},
        "smtp_user" : {"type" : "string"},
        "smtp_password" : {"type" : "string"},
        "use_ssl": {"type" : "boolean"},
    },
}

SLACK_CONFIG_SCHEMA = {
    "type" : "object",
    "required": ['webhook_url'],
    "properties" : {
        "webhook_url" : {"type" : "string"},
    }
}

def validate_config_section(config, section):
    notifications = config.get('notifications') or {}
    if section == 'email':
        email_config = notifications.get('email') or {}
        validate(email_config, EMAIL_CONFIG_SCHEMA)
    elif section == 'slack':
        slack_config = notifications.get('slack') or {}
        validate(slack_config, SLACK_CONFIG_SCHEMA)