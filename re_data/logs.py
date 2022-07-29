from yachalk import chalk

def log_notification_status(start_date, end_date, alerts):
    len_alerts = len(alerts)
    if len_alerts == 0:
        print(f"No alerts found for {start_date} to {end_date}", chalk.green("SUCCESS"))
    else:
        print(
            f"There was {len_alerts} tables with alerts", chalk.green("SUCCESS")
        )