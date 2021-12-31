from tabulate import tabulate
import json


def generate_alert_message(alert_data: dict, column_name: str) -> str:
    """
    Generates an alert message.
    :param alert_data:
        Alert data exported from dbt-re-data.
    :param column_name:
        Column name.
    :return: str
        Generated message for the alert.
    """
    last_value, last_avg = float(alert_data['last_value']), float(alert_data['last_avg'])
    metric = alert_data['metric']
    percentage = abs(round((last_value - last_avg) / last_avg * 100, 2))
    compare_text = 'greater than' if last_value > last_avg else 'less than'
    metric_text = f'{metric}({column_name})' if column_name != '' else metric
    message = f'{metric_text} {percentage}% is {compare_text} average.'
    return message


def generate_metric_value_text(metric_value: str, metric) -> str:
    """
    Generates a metric value text depending on the type of metric.
    :param metric_value: str
        Metric value.
    :param metric: str
        Metric name.
    :return: str
        Formatted metric value text.
    """
    if metric == 'freshness':
        val = round(int(metric_value) / 60 / 60, 2)
        return f'{val} hours'
    elif 'percent' in metric:
        return f'{round(float(metric_value), 2)}%'
    elif 'count' in metric:
        return f'{int(metric_value)}'
    else:
        return f'{round(float(metric_value), 2)}'


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
        alert_data = json.loads(alert['data'])
        column_name = alert['column_name']
        if alert['type'] == 'alert':
            metric_value = alert_data['last_value']
            metric_value_text = generate_metric_value_text(metric_value, alert_data['metric'])
            message = generate_alert_message(alert_data, column_name)
            table.append([
                alert['table_name'].replace('"', ''),
                message,
                metric_value_text,
                alert_data['time_window_end'],
            ])
    return tabulate(table, headers=['Model', 'Message', 'Metric Value', 'Time Window'], tablefmt='orgtbl')
