import {AggregatedAlerts, Anomaly, Metric, SchemaChange} from "../contexts/redataOverviewContext";

export const RE_DATA_OVERVIEW_FILE = 'overview.json';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export const stripQuotes = (str: string) => {
    return str.replaceAll('"', '').replaceAll('`', '');
};

export const extractComponentFromIdentifier = (identifier: string | null, component: string): string => {
    if (!identifier) return '';
    const arr = identifier.split('.');
    const mapping: { [key: string]: number } = {
        database: 0,
        schema: 1,
        tableName: 2,
        columnName: 3,
        metricName: 4,
    };
    const idx = mapping[component];
    if (!idx || idx >= arr.length) {
        return ''
    }
    return arr[idx];
};

export const generateAnomaliesByTimeWindowEnd = (alert: AggregatedAlerts) => {
    const anomalyMap = alert.anomalies;
    // const schemaChangesMap = alert.schemaChanges;
    const alertsByTimeWindowEnd: { [key: string]: Array<Anomaly> } = {};
    for (const anomalies of anomalyMap.values()) {
        for (const anomaly of anomalies) {
            if (!alertsByTimeWindowEnd.hasOwnProperty(anomaly.time_window_end)) {
                alertsByTimeWindowEnd[anomaly.time_window_end] = [anomaly]
            } else {
                alertsByTimeWindowEnd[anomaly.time_window_end].push(anomaly)
            }
        }
    }
    return alertsByTimeWindowEnd;
};

export const generateAlertMessage = (anomaly: Anomaly): string => {
    const compareText = anomaly.last_value > anomaly.last_avg ? 'greater than' : 'less than';
    const percentage = ((Math.abs(anomaly.last_value - anomaly.last_avg) / anomaly.last_avg) * 100).toFixed(2);
    const show_name =  anomaly.column_name ? `${anomaly.metric}(${anomaly.column_name})` : `${anomaly.metric}`;
    return `${show_name} is ${percentage}% ${compareText} average`;
};

export const generateAnomalyValue = (anomaly: Anomaly): string => {
    if (anomaly.metric === 'freshness') {
        const hours = anomaly.last_value / 60 / 60
        return `${hours.toFixed(2)} hours`;
    }
    else if (anomaly.metric.indexOf('percent') > -1) {
        return `${anomaly.last_value.toFixed(2)}%`;
    }
    else if (anomaly.metric.indexOf('count') > -1) {
        return `${anomaly.last_value}`;
    }
    else {
        return `${anomaly.last_value.toFixed(2)}`;
    }
};

export const metricValue = (metric: Metric): number => {
    if (metric.metric === 'freshness') {
        return metric.value / 60 / 60;
    }
    else {
        return metric.value
    }
}

export const getFormatter = (metricName: string): string => {
    if (metricName === 'freshness') {
        return '{value} hours'
    }
    else if (metricName.indexOf('percent') > -1) {
        return `{value}%`;
    }
    return '{value}'
}

export const generateSchemaChangeMessage = (change: SchemaChange): string => {
    let message = ''
    switch (change.operation) {
        case 'column_added':
            message = `column ${change.column_name} of type ${change.data_type} was added`;
            break;
        case 'column_removed':
            message = `column ${change.prev_column_name} of type ${change.prev_data_type} was removed`;
            break;
        case 'type_change':
            message = `${change.column_name} column data type was changed from ${change.prev_data_type} to 
            ${change.data_type}`;
            break;
        default:
            message = ''
    }
    return message;
};
