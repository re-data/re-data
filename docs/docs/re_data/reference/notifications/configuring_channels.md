---
sidebar_position: 2
---

# Configuring Channels and Sending Alerts

Before using the notify command to send alerts, we need to configure the respective channels.

## Slack
To send alerts to a slack channel, we make use of [incoming webhooks](https://api.slack.com/messaging/webhooks) which is a simple way to post messages from apps into Slack.

The steps required to enable incoming webhooks and get started can be found in the slack [API docs](https://api.slack.com/messaging/webhooks#enable_webhooks). Once you have created an incoming webhook successfully, you should see a new entry under Webhook URLs for Your Workspace section, with a Webhook URL that'll look something like this:
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

The webhook url can now be used with the re_data notify command as shown below,

```bash
re_data notify slack \
--start-date 2021-01-01 \
--end-date 2021-01-31 \
--webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX \
--select anomaly \
--select test \
--select schema_change \
--subtitle="[Optional] Markdown text to be added as a subtitle in the slack message generated"
```

or configure in re_data.yml

```yaml title="~/.re_data/re_data.yml"
notifications:
  slack:
    webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

Below is a sample alert notification message sent by a slack app created.

![SlackMessage](/screenshots/notifications/slack_notification_message.png)

By default, the most recent 10 alerts are shown (for each table) and you can generate the Observability UI to show more details relating to alerts.

## Email

Before you can send alerts via email, you need to have configured an email account on the SMTP server you are going to use to send the email.

- mail_from: Email address to set as the email's from
- smtp_host: SMTP server to use
- smtp_port: SMTP port to use
- smtp_user: SMTP user to use
- smtp_password: SMTP password to use
- use_ssl: Use SSL to connect to SMTP server


```yaml title="~/.re_data/re_data.yml"
notifications:
  email:
    mail_from: notifications@getre.io
    smtp_host: smtp.sendgrid.net
    smtp_port: 465
    smtp_user: username
    smtp_password: xxxxx
    use_ssl: true
```

Email alerts can now be sent using the command as shown below
```bash
re_data notify email \
--start-date 2021-01-01 \
--end-date 2021-01-31 \
--select anomaly \
--select test \
--select schema_change
```

Below is a sample alert notification message sent by a slack app created.
![EmailAlertMessage](/screenshots/notifications/email_notification_message.png)

:::info
### Having issues?
If you have more questions, got stuck anywhere, or something is not working as expected, please let us know on **[Slack! 😊](https://www.getre.io/slack)**, we will help you asap, and it will help us improve this quick start guide.