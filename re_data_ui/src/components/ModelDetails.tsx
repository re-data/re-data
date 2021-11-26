import React, {ReactElement, useContext} from "react";
import {useSearchParams} from "react-router-dom"
import {
    AggregatedAlerts,
    AggregatedMetrics, Anomaly, Metric,
    OverviewData,
    RedataOverviewContext, SchemaChange
} from "../contexts/redataOverviewContext";
import {DATE_TIME_FORMAT, extractComponentFromIdentifier} from "../utils/helpers";
import * as echarts from 'echarts/core';
import {LineChart, LineSeriesOption} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    TitleComponentOption, TooltipComponentOption, GridComponentOption,
    MarkAreaComponent
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import EChartsReactCore from "echarts-for-react/lib/core";
import {UniversalTransition} from "echarts/features";
import moment from "moment/moment";

type ECOption = echarts.ComposeOption<| LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption>;

echarts.use(
    [
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LineChart,
        CanvasRenderer,
        UniversalTransition,
        MarkAreaComponent
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

const generateMetricCharts = (data: AggregatedMetrics, alerts: AggregatedAlerts): ReactElement => {
    const tableMetricCharts = (
        Array.from(data.tableMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
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
            };
            return (
                <div key={key}>
                    <EChartsReactCore echarts={echarts} option={options}/>
                </div>
            )
        }));
    return (
        <div>
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
        <div className='col-span-2 h-auto overflow-scroll'>
            <div className="bg-white rounded shadow border p-3">
                <div className="mb-3">
                    <span
                        className="text-2xl text--capitalize font-bold">Model: {extractComponentFromIdentifier(fullTableName, 'tableName')}</span>
                </div>
                {!modelExists ? (<span>No metrics</span>) : generateMetricCharts(data, alerts)}
            </div>
        </div>

    );
};

export default ModelDetails;
