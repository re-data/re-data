import React, {ReactElement, useContext} from "react";
import {useSearchParams} from "react-router-dom"
import {
    AggregatedAlerts,
    AggregatedMetrics, Anomaly, Metric,
    OverviewData,
    RedataOverviewContext, SchemaChange
} from "../contexts/redataOverviewContext";
import {
    DATE_TIME_FORMAT,
    extractComponentFromIdentifier,
    generateAlertMessage,
    generateAnomaliesByTimeWindowEnd
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

const generateAlertTooltip = (anomaliesByTimeWindowEnd: { [p: string]: Array<Anomaly> }, volume: number, timeWindowEnd: string) => {
    const anomalies = anomaliesByTimeWindowEnd[timeWindowEnd];
    const messages: string[] = [];
    for (const anomaly of anomalies) {
        const msg = generateAlertMessage(anomaly);
        messages.push(msg);
    }
    return messages.join('<br>')
};

const generateMetricCharts = (data: AggregatedMetrics, alerts: AggregatedAlerts): React.ReactElement => {
    const anomaliesByTimeWindowEnd = generateAnomaliesByTimeWindowEnd(alerts);
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
                    data: metrics.map(m => m.time_window_end),
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
                    data: metrics.map(m => m.time_window_end),
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
            return (
                <div key={key}>
                    <EChartsReactCore echarts={echarts} option={options}/>
                </div>
            )
        }));

    const arr = [];
    for (const key in anomaliesByTimeWindowEnd) {
        arr.push([key, anomaliesByTimeWindowEnd[key].length ? 1 : 0]);
    }

    const alertScatterPlotOptions = {
        tooltip: {
            position: ['40', '15'],
            formatter: (params: any) => {
                return `${generateAlertTooltip(anomaliesByTimeWindowEnd, params.data[1], params.data[0])}`
            }
        },
        title: {
            textBaseline: "middle",
            top: "5%",
            text: "Alerts"
        },
        singleAxis: {
            left: '15%',
            right: '10%',
            type: "category",
            boundaryGap: false,
            data: timeRange,
            top: "20%",
            splitLine: {
                show: true
            },
            height: "50",
            axisLabel: {
                interval: 28
            }
        },
        series: {
            coordinateSystem: 'singleAxis',
            type: 'scatter',
            color: '#ee2828',
            data: arr,
            symbolSize: (dataItem: any) => {
                return dataItem[1] * 15;
            }
        }
    }
    return (
        <div>
            <div className="h-44">
                <EChartsReactCore echarts={echarts} option={alertScatterPlotOptions}/>
            </div>
            <span className="text-lg text--capitalize">Table Metrics</span>
            {tableMetricCharts}
            <span className="text-lg text--capitalize">Column Metrics</span>
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
        <div className='col-span-3 h-auto overflow-scroll'>
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
