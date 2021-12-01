import React, {ReactElement, useContext} from "react";
import {useSearchParams} from "react-router-dom"
import {
    AggregatedAlerts,
    AggregatedMetrics, Anomaly, Metric,
    OverviewData,
    RedataOverviewContext, SchemaChange
} from "../contexts/redataOverviewContext";
import {
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    extractComponentFromIdentifier, generateSchemaChangeMessage,
} from "../utils/helpers";
import * as echarts from 'echarts/core';
import {LineChart, LineSeriesOption, ScatterChart, ScatterSeriesOption} from 'echarts/charts';
import {
    GridComponent,
    GridComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    TitleComponent,
    TitleComponentOption,
    SingleAxisComponent,
    SingleAxisComponentOption,
    VisualMapComponent,
    VisualMapComponentOption,
    MarkAreaComponent,
    MarkAreaComponentOption
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import EChartsReactCore from "echarts-for-react/lib/core";
import {UniversalTransition} from "echarts/features";
import moment from "moment/moment";

type ECOption = echarts.ComposeOption<| LineSeriesOption
    | TitleComponentOption
    | ScatterSeriesOption
    | MarkAreaComponentOption
    | VisualMapComponentOption
    | SingleAxisComponentOption
    | TooltipComponentOption
    | GridComponentOption>;

echarts.use(
    [
        LineChart,
        ScatterChart,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        SingleAxisComponent,
        VisualMapComponent,
        UniversalTransition,
        MarkAreaComponent,
        CanvasRenderer
    ]
);

const generateMarkAreas = (alerts: AggregatedAlerts, columnName: string, metricName: string): any => {
    const arr = []
    const anomaliesMap = alerts.anomalies;
    // '' empty string key contains anomalies for table level metrics.
    const anomalies = anomaliesMap.has(columnName)
        ? anomaliesMap.get(columnName)
        : anomaliesMap.has('') ? anomaliesMap.get('') : [];
    for (const anomaly of (anomalies!)) {
        if (anomaly.metric === metricName) {
            arr.push([{xAxis: moment(anomaly.time_window_end).subtract(anomaly.interval_length_sec, 's').format(DATE_TIME_FORMAT)}, {xAxis: anomaly.time_window_end}])
        }
    }
    return arr
}

const generatePiecesForVisualMap = (metrics: Array<Metric>, alerts: AggregatedAlerts, columnName: string) => {
    const pieces: any = [];
    const anomalies = alerts.anomalies;
    const anomaliesTimeWindow = (anomalies.has(columnName) ? anomalies.get(columnName) : []) as Array<Anomaly>;
    const set = new Set(anomaliesTimeWindow.map(a => `${a.metric}_${a.time_window_end}`))
    for (let i = 0; i < metrics.length; i++) {
        const metric = metrics[i];
        const key = `${metric.metric}_${metric.time_window_end}`
        if (set.has(key)) {
            pieces.push({
                gt: i - 1,
                lte: i
            })
        }
    }
    return pieces;
};

const generateMetricCharts = (data: AggregatedMetrics, alerts: AggregatedAlerts): React.ReactElement => {
    const anomalies = alerts.anomalies;
    const schemaChanges: SchemaChange[] = [];
    for (const changes of alerts.schemaChanges.values()) {
        schemaChanges.push(...changes);
    }
    const alertChartOptions: Array<[string, ECOption]> = []
    let timeRange: string[] = [];
    const tableMetricCharts = (
        Array.from(data.tableMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            const pieces = generatePiecesForVisualMap(metrics, alerts, columnName);
            const options: ECOption = {
                title: {
                    text: `${extractComponentFromIdentifier(key, 'metricName')}`,
                },
                grid: {top: '20%', right: '5%', bottom: '12%', left: '12%'},
                xAxis: {
                    type: 'category',
                    data: metrics.map(m => moment(m.time_window_end).format(DATE_FORMAT)),
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: extractComponentFromIdentifier(key, 'metricName'),
                        data: metrics.map(m => m.value),
                        type: 'line',
                        color: '#8884d8',
                        smooth: true,
                        markArea: {
                            itemStyle: {
                                color: 'rgba(255, 173, 177, 0.4)'
                            },
                            data: generateMarkAreas(alerts, columnName, metricName)
                        }
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: pieces,
                    inRange: {
                        color: pieces.length ? '#ee2828' : '#8884d8', // if no anomaly exists, everything is in range hence don't color red
                    },
                    outOfRange: {
                        color: '#8884d8',
                    }
                }
            };
            if (anomalies.has(columnName)) {
                const tableAnomalies = anomalies.get(columnName) as Anomaly[];
                for (const anomaly of tableAnomalies) {
                    if (anomaly.metric === metricName) {
                        alertChartOptions.push([key, options]);
                    }
                }
            }
            return (
                <div key={key}>
                    <EChartsReactCore echarts={echarts} option={options}/>
                </div>
            )
        }));
    const columnMetricCharts = (
        Array.from(data.columnMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            if (!timeRange.length) {
                timeRange = metrics.map(m => m.time_window_end)
            }
            const pieces = generatePiecesForVisualMap(metrics, alerts, columnName);
            const options: ECOption = {
                title: {
                    text: `${extractComponentFromIdentifier(key, 'metricName')}(${extractComponentFromIdentifier(key, 'columnName')})`
                },
                grid: {top: '20%', right: '5%', bottom: '12%', left: '12%'},
                xAxis: {
                    type: 'category',
                    data: metrics.map(m => moment(m.time_window_end).format(DATE_FORMAT)),
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: metricName,
                        data: metrics.map(m => m.value),
                        type: 'line',
                        color: '#8884d8',
                        smooth: true,
                        markArea: {
                            itemStyle: {
                                color: 'rgba(255, 173, 177, 0.4)'
                            },
                            data: generateMarkAreas(alerts, columnName, metricName)
                        },
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: pieces,
                    inRange: {
                        color: pieces.length ? '#ee2828' : '#8884d8', // if no anomaly exists, everything is in range hence don't color red
                    },
                    outOfRange: {
                        color: '#8884d8',
                    }
                }
            };
            if (anomalies.has(columnName)) {
                const columnAnomalies = anomalies.get(columnName) as Anomaly[];
                const seen = new Set()
                for (const anomaly of columnAnomalies) {
                    if (anomaly.metric === metricName && anomaly.column_name === columnName && !seen.has(key)) {
                        alertChartOptions.push([key, options]);
                        seen.add(key)
                    }
                }
            }
            return (
                <div key={key}>
                    <EChartsReactCore echarts={echarts} option={options}/>
                </div>
            )
        }));

    const alertMetricCharts = alertChartOptions.map(([key, option]) => {
        key = `alert_${key}`
        return (
            <div key={key}>
                <EChartsReactCore echarts={echarts} option={option}/>
            </div>
        )
    })

    return (
        <div>
            <div className='mb-3 grid grid-cols-1'>
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>

                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Schema Changes
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">

                                    {schemaChanges.map(change => (
                                        <tr key={change.id + '_' + change.prev_column_name}>
                                            <td className="px-6 text-sm py-4 whitespace-nowrap">
                                                <div
                                                    className="text-gray-900">
                                                <span
                                                    className="badge mb-3 bg-yellow-300 rounded-full px-2 py-1
                                         text-center object-right-top text-white text-sm mr-1">!</span>
                                                    {generateSchemaChangeMessage(change)} at {moment(change.detected_time).format(DATE_TIME_FORMAT)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span className="text-lg text--capitalize underline">Alerts</span>
            <br/>
            {alertMetricCharts}
            <span className="text-lg text--capitalize underline">Table Metrics</span>
            {tableMetricCharts}
            <span className="text-lg text--capitalize underline">Column Metrics</span>
            {columnMetricCharts}
        </div>
    );
}

const ModelDetails: React.FC = (): ReactElement => {
    const [searchParams] = useSearchParams();
    let modelExists = false;
    const fullTableName = searchParams.get('model');
    const overview: OverviewData = useContext(RedataOverviewContext);

    let data: AggregatedMetrics = {
        tableMetrics: new Map<string, Array<Metric>>(),
        columnMetrics: new Map<string, Array<Metric>>()
    };
    let alerts: AggregatedAlerts = {
        anomalies: new Map<string, Array<Anomaly>>(),
        schemaChanges: new Map<string, Array<SchemaChange>>()
    };
    if (typeof fullTableName === "string" && overview.aggregated_metrics.has(fullTableName)) {
        modelExists = true;
        data = overview.aggregated_metrics.get(fullTableName) as AggregatedMetrics;
        if (overview.aggregated_alerts.has(fullTableName)) {
            alerts = overview.aggregated_alerts.get(fullTableName) as AggregatedAlerts;
        }
    }
    return (
        <div className='col-span-4 h-auto overflow-scroll'>
            <div className="bg-white rounded shadow border p-3">
                <div className="mb-3">
                    <span
                        className="text-2xl text--capitalize font-bold">Model: {extractComponentFromIdentifier(fullTableName, 'tableName')}</span>
                </div>
                {!modelExists ? (
                    <span>No metrics</span>) : generateMetricCharts(data, alerts)}
            </div>
        </div>

    );
};

export default ModelDetails;
