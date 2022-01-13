from tabulate import tabulate


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
            alert['model'],
            alert['message'],
            alert['value'],
            alert['time_window_end'],
        ])
    return tabulate(table, headers=['Model', 'Message', 'Value', 'Time Window'], tablefmt='orgtbl')
