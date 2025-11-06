import json
import logging
from datetime import datetime
from typing import Optional

import requests


SLACK_SIZE_LIMIT = 50000
INFO_MARKERS = [":label:", ":busts_in_silhouette:", ":warning:", ":bulb:", ":bangbang:"]
TRACKING_PREFIXES = [
    "acquisition_ltv_predictions_log_dev_workflow_extended_",
    "ltv_predictions_log_dev_workflow_extended_",
    "acquisition_tracking_simple_",
    "acquisition_tracking_",
    "anomaly_tracking_simple_",
    "anomaly_tracking_",
    "estuary_tracking_",
    "acquisition_table_",
]


def slack_notify(webhook_url: str, body: dict) -> None:
    """Send message(s) to Slack webhook. Splits into multiple messages if needed."""
    headers = {"Content-Type": "application/json"}
    message_size = len(json.dumps(body))

    if message_size > SLACK_SIZE_LIMIT:
        logging.warning(f"Message size ({message_size} bytes) exceeds limit. Splitting...")
        messages = split_slack_message(body)
    else:
        messages = [body]

    for msg in messages:
        response = requests.post(webhook_url, json=msg, headers=headers)
        response.raise_for_status()


def split_slack_message(message_obj: dict) -> list:
    """Split large message into multiple messages, preserving context in each."""
    if "blocks" not in message_obj:
        return [message_obj]

    # Categorize blocks
    categorized = {"header": [], "info": [], "alert": [], "footer": []}
    for block in message_obj["blocks"]:
        block_type = block.get("type")
        if block_type == "header":
            categorized["header"].append(block)
        elif block_type == "context":
            categorized["footer"].append(block)
        elif block_type == "section":
            text = block.get("text", {}).get("text", "")
            category = "info" if any(m in text for m in INFO_MARKERS) else "alert"
            categorized[category].append(block)

    base_blocks = categorized["header"] + categorized["info"]
    base_size = len(json.dumps({"blocks": base_blocks + categorized["footer"]}))

    if base_size > SLACK_SIZE_LIMIT:
        logging.error("Base message exceeds 50KB. Sending as-is.")
        return [message_obj]

    messages = []
    current_blocks = base_blocks.copy()

    # Process alert blocks, splitting line-by-line if needed
    for alert_block in categorized["alert"]:
        text = alert_block.get("text", {}).get("text", "")

        if text.startswith("*") and "\n" in text and "```" in text:
            title = text.split("\n")[0]
            content = text[len(title) + 1 :]

            if content.startswith("```") and content.endswith("```"):
                lines = content[3:-3].strip().split("\n")
                current_lines = []

                for line in lines:
                    test_block = _create_alert_block(title, current_lines + [line])
                    test_size = len(json.dumps({"blocks": current_blocks + [test_block] + categorized["footer"]}))

                    if test_size > SLACK_SIZE_LIMIT and current_lines:
                        # Save current message and start new one
                        messages.append(
                            {
                                "blocks": current_blocks
                                + [_create_alert_block(title, current_lines)]
                                + categorized["footer"]
                            }
                        )
                        current_blocks = base_blocks.copy()
                        current_lines = [line]
                    else:
                        current_lines.append(line)

                if current_lines:
                    current_blocks.append(_create_alert_block(title, current_lines))
            else:
                current_blocks.append(alert_block)
        else:
            current_blocks.append(alert_block)

    # Add final message
    if current_blocks != base_blocks:
        messages.append({"blocks": current_blocks + categorized["footer"]})

    return messages or [message_obj]


def _create_alert_block(title: str, lines: list) -> dict:
    """Create an alert section block with title and code-formatted lines."""
    content = "\n".join(lines)
    return {"type": "section", "text": {"type": "mrkdwn", "text": f"{title}\n ```{content}```"}}


def format_alerts(alerts: list, limit: Optional[int] = None) -> str:
    """Format alerts as timestamped list."""
    formatted = []
    for alert in alerts:
        time = datetime.strptime(alert["time_window_end"], "%Y-%m-%d %H:%M:%S")
        formatted.append(f"[{time.strftime('%Y-%m-%d %H:%M')}] {alert['message']}")

    return "\n".join(formatted[:limit] if limit else formatted)


def format_table_name(table_name: str) -> str:
    """Format table name: remove quotes, extract dataset.table, remove tracking prefixes."""
    table_name = table_name.replace('"', "").replace("`", "")
    parts = table_name.split(".")

    if len(parts) < 2:
        return table_name

    dataset = parts[-2] if len(parts) >= 3 else parts[0]
    table = parts[-1]

    # Remove tracking prefix if found
    for prefix in TRACKING_PREFIXES:
        if prefix in table:
            idx = table.find(prefix)
            if idx != -1:
                table = table[idx + len(prefix) :]
                break

    return f"{dataset}.{table}"


def generate_slack_message(
    model: str, details: dict, owners: list, subtitle: str, selected_alert_types: set, tags: Optional[list] = None
) -> dict:
    """Generate Slack message with alerts for a model."""
    formatted_table = format_table_name(model)
    slack_owners = [owner[0] for owner in owners]

    # Build header and info blocks
    blocks = [{"type": "header", "text": {"type": "plain_text", "text": f":mag: {formatted_table}", "emoji": True}}]

    info_parts = []
    if tags:
        info_parts.append(f":label: {', '.join(f'`{tag}`' for tag in tags)}")
    if slack_owners:
        info_parts.append(f":busts_in_silhouette: {', '.join(slack_owners)}")

    if info_parts:
        blocks.append({"type": "section", "text": {"type": "mrkdwn", "text": "\n".join(info_parts)}})

    # Add alert summary
    anomalies, schema_changes, tests = details["anomalies"], details["schema_changes"], details["tests"]
    summary = f":warning: {len(anomalies)} anomalies  |  :bulb: {len(schema_changes)} schema changes  |  :bangbang: {len(tests)} failed tests"
    blocks.append({"type": "section", "text": {"type": "mrkdwn", "text": summary}})

    # Add alert detail sections
    alert_configs = [
        (anomalies, "anomaly", "Anomalies"),
        (schema_changes, "schema_change", "Schema Changes"),
        (tests, "test", "Tests failures"),
    ]

    for alerts, alert_type, title in alert_configs:
        if alerts and alert_type in selected_alert_types:
            alert_text = format_alerts(alerts, limit=10)
            if len(alert_text) > 2000:
                alert_text = alert_text[:2000] + "... (truncated)"
            blocks.append({"type": "section", "text": {"type": "mrkdwn", "text": f"*{title}*\n ```{alert_text}```"}})

    message_obj = {"blocks": blocks}
    _add_footer(message_obj, subtitle)
    return message_obj


def generate_all_good_slack_message(subtitle: str) -> dict:
    """Generate 'all good' message when no alerts are found."""
    message_obj = {
        "blocks": [
            {"type": "header", "text": {"type": "plain_text", "text": "All Good! :tada:", "emoji": True}},
            {"type": "divider"},
            {
                "type": "section",
                "text": {"type": "plain_text", "text": "re_data didn't find any alerts at the moment", "emoji": True},
            },
        ]
    }
    _add_footer(message_obj, subtitle)
    return message_obj


def _add_footer(message_obj: dict, subtitle: Optional[str]) -> None:
    """Add footer with optional subtitle and timestamp."""
    if subtitle:
        message_obj["blocks"].append({"type": "section", "text": {"type": "mrkdwn", "text": subtitle}})

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_obj["blocks"].append(
        {
            "type": "context",
            "elements": [
                {
                    "type": "plain_text",
                    "text": f"Generated at {timestamp}. Check re_data UI for more details",
                    "emoji": True,
                }
            ],
        }
    )
