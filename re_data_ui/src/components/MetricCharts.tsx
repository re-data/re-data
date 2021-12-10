import React, {PropsWithChildren, ReactElement} from "react";
import {ReDataModelDetails, Anomaly, Metric} from "../contexts/redataOverviewContext";
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
    modelDetails: ReDataModelDetails,
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

const generateMarkAreas = (details: ReDataModelDetails, columnName: string, metricName: string): any => {
    const arr = []
    const anomaliesMap = details.anomalies;
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

const generatePiecesForVisualMap = (metrics: Array<Metric>, details: ReDataModelDetails, columnName: string) => {
    const pieces: any = [];
    const anomalies = details.anomalies;
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

const generateMetricChartOptions = (metrics: Array<Metric>, title: string, metricName: string, details: ReDataModelDetails, columnName: string, pieces: []) => {
    const options: ECOption = {
        title: {
            text: title,
        },
        grid: {top: '20%', right: '5%', bottom: '12%', left: '15%'},
        xAxis: {
            type: 'category',
            data: metrics.map(m => dayjs(m.time_window_end).format(DATE_FORMAT)),
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: getFormatter(metricName),
            }
        },
        series: [
            {
                name: title,
                data: metrics.map(metricValue),
                type: 'line',
                color: '#8884d8',
                smooth: true,
                markArea: {
                    itemStyle: {
                        color: 'rgba(255, 173, 177, 0.4)'
                    },
                    data: generateMarkAreas(details, columnName, metricName)
                },
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

    return options;
};

const MetricCharts: React.FC<MetricChartsProps> = (props: PropsWithChildren<MetricChartsProps>): ReactElement => {
    const anomalies = props.modelDetails.anomalies;
    const metrics = props.modelDetails.metrics;
    const alertChartOptions: Array<[string, ECOption]> = []
    const tableMetricCharts = (
        Array.from(metrics.tableMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            const pieces = generatePiecesForVisualMap(metrics, props.modelDetails, columnName);
            const title = `${extractComponentFromIdentifier(key, 'metricName')}`;
            const options: ECOption = generateMetricChartOptions(metrics, title, metricName, props.modelDetails, columnName, pieces);
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
        Array.from(metrics.columnMetrics).map(([key, metrics]) => {
            const metricName = extractComponentFromIdentifier(key, 'metricName');
            const columnName = extractComponentFromIdentifier(key, 'columnName');
            const title = `${extractComponentFromIdentifier(key, 'metricName')}(${extractComponentFromIdentifier(key, 'columnName')})`;
            const pieces = generatePiecesForVisualMap(metrics, props.modelDetails, columnName);
            const options: ECOption = generateMetricChartOptions(metrics, title, metricName, props.modelDetails, columnName, pieces);
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
