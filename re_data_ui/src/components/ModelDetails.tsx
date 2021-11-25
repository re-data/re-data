import React, {ReactElement, useContext} from "react";
import {useSearchParams} from "react-router-dom"
import {AggregatedMetrics, OverviewData, RedataOverviewContext} from "../contexts/redataOverviewContext";
import {extractComponentFromIdentifier} from "../utils/helpers";
import * as echarts from 'echarts/core';
import {LineChart, LineSeriesOption} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    TitleComponentOption, TooltipComponentOption, GridComponentOption
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import EChartsReactCore from "echarts-for-react/lib/core";
import {UniversalTransition} from "echarts/features";

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
        UniversalTransition
    ]
);

const generateMetricCharts = (data: AggregatedMetrics): ReactElement => {
    const tableMetricCharts = (
        Array.from(data.tableMetrics).map(([key, metrics]) => {
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
                markArea: {},
                series: [
                    {
                        name: extractComponentFromIdentifier(key, 'metricName'),
                        data: metrics.map(m => m.value),
                        type: 'line',
                        color: '#8884d8',
                        smooth: true,
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
    // @ts-ignore
    let data: AggregatedMetrics = [];
    if (typeof fullTableName === "string" && overview.aggregated_metrics.has(fullTableName)) {
        modelExists = true;
        // @ts-ignore
        data = overview.aggregated_metrics.get(fullTableName);
    }
    return (
        <div className='col-span-2 h-auto overflow-scroll'>
            <div className="bg-white rounded shadow border p-3">
                <div className="mb-3">
                    <span
                        className="text-2xl text--capitalize font-bold">Model: {extractComponentFromIdentifier(fullTableName, 'tableName')}</span>
                </div>
                {!modelExists ? (<span>No metrics</span>) : generateMetricCharts(data)}
            </div>
        </div>

    );
};

export default ModelDetails;
