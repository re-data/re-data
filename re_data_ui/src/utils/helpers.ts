import {AggregatedAlerts} from "../contexts/redataOverviewContext";

export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

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
    const alertsByTimeWindowEnd: { [key: string]: number } = {};
    for (const anomalies of anomalyMap.values()) {
        for (const anomaly of anomalies) {
            if (!alertsByTimeWindowEnd.hasOwnProperty(anomaly.time_window_end)) {
                alertsByTimeWindowEnd[anomaly.time_window_end] = 1
            } else {
                alertsByTimeWindowEnd[anomaly.time_window_end] += 1
            }
        }
    }
    return alertsByTimeWindowEnd;
};
