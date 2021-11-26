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
