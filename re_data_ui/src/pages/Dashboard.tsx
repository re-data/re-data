import React, {ReactElement} from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {Outlet} from 'react-router-dom';
import {AggregatedMetrics, Metric, OverviewData, RedataOverviewContext} from "../contexts/redataOverviewContext";
import moment from 'moment';
import {stripQuotes} from "../utils/helpers";

interface RawOverviewData {
    anomalies: string | null;
    metrics: string | null;
    graph: string;
    generated_at: string;
}

const extractMetrics = (overview: OverviewData) => {
    const metrics = overview.metrics;
    const finalOverview: Map<string, AggregatedMetrics> = new Map();
    for (const metric of metrics) {
        const tableName = stripQuotes(metric.table_name);
        const columnName = stripQuotes(metric.column_name);
        const metricName = stripQuotes(metric.metric);
        if (!finalOverview.has(tableName)) {
            finalOverview.set(tableName, {
                tableMetrics: new Map<string, Array<Metric>>(),
                columnMetrics: new Map<string, Array<Metric>>(),
            });
        }
        const metricMap = (finalOverview.get(tableName)!);
        if (!columnName) { // table metric
            const key = `${tableName}_${metricName}`;
            if (metricMap.tableMetrics.has(key)) {
                (metricMap.tableMetrics.get(key)!).push(metric);
            } else {
                metricMap.tableMetrics.set(key, [metric]);
            }
        } else {
            const key = `${tableName}_${columnName}_${metricName}`;
            if (metricMap.columnMetrics.has(key)) {
                (metricMap.columnMetrics.get(key)!).push(metric);
            } else {
                metricMap.columnMetrics.set(key, [metric]);
            }
        }
    }
    // loop through each table/model and sort by ascending order by time_window_end for table and column metrics
    for (const metricMap of finalOverview.values()) {
        for (const [key, metrics] of metricMap.tableMetrics) {
            const sortedMetrics = metrics.sort((a: Metric, b: Metric) => moment(a.time_window_end).diff(b.time_window_end));
            metricMap.tableMetrics.set(key, sortedMetrics);
        }
        for (const [key, metrics] of metricMap.columnMetrics) {
            const sortedMetrics = metrics.sort((a: Metric, b: Metric) => moment(a.time_window_end).diff(b.time_window_end));
            metricMap.tableMetrics.set(key, sortedMetrics);
        }
    }
    return finalOverview;
};

// const overview: Array<RawOverviewData> = require('../overview.json');
const overview: Array<RawOverviewData> = require('../re_data_overview.json.json');

const prepareOverviewData = (raw: Array<RawOverviewData>) => {
    const data = raw[0];
    const overview: OverviewData = {
        anomalies: data.anomalies ? JSON.parse(data.anomalies as string) : [],
        metrics: data.metrics ? JSON.parse(data.metrics as string) : [],
        aggregated_metrics: new Map<string, AggregatedMetrics>(),
        graph: JSON.parse(data.graph as string),
        generated_at: data.generated_at,
    }
    overview.aggregated_metrics = extractMetrics(overview);
    console.log(overview)
    return overview;
};

const Dashboard: React.FC = (): ReactElement => {
    return (
        <RedataOverviewContext.Provider value={prepareOverviewData(overview)}>
            <div className="relative min-h-screen md:flex" data-dev-hint="container">
                <Header/>
                <Sidebar/>

                <main id="content" className="flex-1 p-6 lg:px-8 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="px-4 py-6 sm:px-0">
                            <Outlet/>
                        </div>
                    </div>
                </main>
            </div>
        </RedataOverviewContext.Provider>
    );
};

export default Dashboard;
