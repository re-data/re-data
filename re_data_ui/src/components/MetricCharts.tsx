import React, {PropsWithChildren, ReactElement} from "react";
import {AggregatedAlerts, AggregatedMetrics, Anomaly, Metric} from "../contexts/redataOverviewContext";
import {DATE_FORMAT, extractComponentFromIdentifier, getFormatter, metricValue} from "../utils/helpers";
import dayjs from "dayjs";
import EChartsReactCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {LineSeriesOption, ScatterSeriesOption} from "echarts/charts";
import {
    GridComponentOption,
    MarkAreaComponentOption,
    SingleAxisComponentOption,
    TitleComponentOption, TooltipComponentOption,
    VisualMapComponentOption
} from "echarts/components";

interface MetricChartsProps {
    alerts: AggregatedAlerts,
    data: AggregatedMetrics,
    showAnomalies: boolean,
}

type ECOption = echarts.ComposeOption<| LineSeriesOption
    | TitleComponentOption
    | ScatterSeriesOption
    | MarkAreaComponentOption
    | VisualMapComponentOption
    | SingleAxisComponentOption
    | TooltipComponentOption
    | GridComponentOption>;

const generateMarkAreas = (alerts: AggregatedAlerts, columnName: string, metricName: string): any => {
    const arr = []
    const anomaliesMap = alerts.anomalies;
    // '' empty string key contains anomalies for table level metrics.
    const anomalies = anomaliesMap.has(columnName)
        ? anomaliesMap.get(columnName)
        : anomaliesMap.has('') ? anomaliesMap.get('') : [];
    for (const anomaly of (anomalies!)) {
        if (anomaly.metric === metricName) {
            arr.push([
                {
                    xAxis: dayjs(anomaly.time_window_end).subtract(anomaly.interval_length_sec, 's').format(DATE_FORMAT)
                },
                {
                    xAxis: dayjs(anomaly.time_window_end).format(DATE_FORMAT)
                }
            ])
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

const MetricCharts: React.FC<MetricChartsProps> = (props: PropsWithChildren<MetricChartsProps>): ReactElement => {
    const anomalies = props.alerts.anomalies;
    const alertChartOptions: Array<[string, ECOption]> = []
    let timeRange: string[] = [];
    const tableMetricCharts = (
        Array.from(props.data.tableMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            const pieces = generatePiecesForVisualMap(metrics, props.alerts, columnName);
            const options: ECOption = {
                title: {
                    text: `${extractComponentFromIdentifier(key, 'metricName')}`,
                },
                grid: {top: '20%', right: '5%', bottom: '12%', left: '12%'},
                xAxis: {
                    type: 'category',
                    data: metrics.map(m => dayjs(m.time_window_end).format(DATE_FORMAT)),
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: getFormatter(metricName)
                    }
                },
                series: [
                    {
                        name: extractComponentFromIdentifier(key, 'metricName'),
                        data: metrics.map(metricValue),
                        type: 'line',
                        color: '#8884d8',
                        smooth: true,
                        markArea: {
                            itemStyle: {
                                color: 'rgba(255, 173, 177, 0.4)'
                            },
                            data: generateMarkAreas(props.alerts, columnName, metricName)
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
        Array.from(props.data.columnMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            if (!timeRange.length) {
                timeRange = metrics.map(m => m.time_window_end)
            }
            const pieces = generatePiecesForVisualMap(metrics, props.alerts, columnName);
            const options: ECOption = {
                title: {
                    text: `${extractComponentFromIdentifier(key, 'metricName')}(${extractComponentFromIdentifier(key, 'columnName')})`
                },
                grid: {top: '20%', right: '5%', bottom: '12%', left: '12%'},
                xAxis: {
                    type: 'category',
                    data: metrics.map(m => dayjs(m.time_window_end).format(DATE_FORMAT)),
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: getFormatter(metricName)
                    }
                },
                series: [
                    {
                        name: metricName,
                        data: metrics.map(metricValue),
                        type: 'line',
                        color: '#8884d8',
                        smooth: true,
                        markArea: {
                            itemStyle: {
                                color: 'rgba(255, 173, 177, 0.4)'
                            },
                            data: generateMarkAreas(props.alerts, columnName, metricName)
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
        <React.Fragment>
            {props.showAnomalies ?
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3">
                    {alertMetricCharts}
                </div> :
                <div>
                    <span className="text-lg text--capitalize">Table Metrics</span>
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3">
                        {tableMetricCharts}
                    </div>
                    <span className="text-lg text--capitalize">Column Metrics</span>
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 mt-3 mb-3">
                        {columnMetricCharts}
                    </div>
                </div>
            }
        </React.Fragment>
    );

}

export default MetricCharts;
