import React, {ReactElement, useEffect, useState} from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {Outlet} from 'react-router-dom';
import {
    ReDataModelDetails, Anomaly,
    Metric,
    OverviewData,
    RedataOverviewContext,
} from "../contexts/redataOverviewContext";
import dayjs from "dayjs";
import {appendToMapKey, generateMetricIdentifier, RE_DATA_OVERVIEW_FILE, stripQuotes} from "../utils/helpers";

interface RawOverviewData {
    anomalies: string | null;
    metrics: string | null;
    schema_changes: string | null;
    graph: string;
    table_schema: string;
    generated_at: string;
}

const groupMetricsByModel = (overview: OverviewData, modelDetails: Map<string, ReDataModelDetails>): void => {
    const metrics = overview.metrics;
    // const groupedMetrics: Map<string, AggregatedMetrics> = new Map();
    for (const metric of metrics) {
        const tableName = stripQuotes(metric.table_name);
        const columnName = stripQuotes(metric.column_name);
        const metricName = stripQuotes(metric.metric);

        const key = generateMetricIdentifier(tableName, columnName, metricName);
        const details = modelDetails.get(tableName) as ReDataModelDetails;
        const metricMap = details.metrics;
        if (!columnName) { // table metric
            appendToMapKey(metricMap.tableMetrics, key, metric);
        } else {
            appendToMapKey(metricMap.columnMetrics, key, metric);
        }
    }
    // loop through each table/model and sort by ascending order by time_window_end for table and column metrics
    for (const details of modelDetails.values()) {
        for (const [key, metrics] of details.metrics.tableMetrics) {
            const sortedMetrics = metrics.sort((a: Metric, b: Metric) => dayjs(a.time_window_end).diff(b.time_window_end));
            details.metrics.tableMetrics.set(key, sortedMetrics);
        }
        for (const [key, metrics] of details.metrics.columnMetrics) {
            const sortedMetrics = metrics.sort((a: Metric, b: Metric) => dayjs(a.time_window_end).diff(b.time_window_end));
            details.metrics.columnMetrics.set(key, sortedMetrics);
        }
    }
};

const groupTableSchemaByModel = (overview: OverviewData, modelDetails: Map<string, ReDataModelDetails>): void => {
    for (const schema of overview.table_schema) {
        const model = stripQuotes(schema.table_name);
        const details = modelDetails.get(model) as ReDataModelDetails;
        details.tableSchema.push(schema);
    }
}

const groupSchemaChangesByModel = (overview: OverviewData, modelDetails: Map<string, ReDataModelDetails>): void => {
    for (const change of overview.schema_changes) {
        const model = stripQuotes(change.table_name);
        const details = modelDetails.get(model) as ReDataModelDetails;
        details.schemaChanges.push(change);
    }
}

const groupAnomaliesByModel = (overview: OverviewData, modelDetails: Map<string, ReDataModelDetails>): void => {
    for (const anomaly of overview.anomalies) {
        const model = stripQuotes(anomaly.table_name);
        anomaly.last_value = Number(anomaly.last_value);
        const columnName = anomaly.column_name ? anomaly.column_name : '_';
        const details = modelDetails.get(model) as ReDataModelDetails;
        const anomalyMap = details.anomalies;
        appendToMapKey(anomalyMap, columnName, anomaly);
    }
}

const prepareModelDetails = (overview: OverviewData): Map<string, ReDataModelDetails> => {
    const tableSchema = overview.table_schema;
    const modelDetails = new Map<string, ReDataModelDetails>();
    // create object for each model
    tableSchema.forEach(schema => {
        const model = stripQuotes(schema.table_name);
        if (!modelDetails.has(model)) {
            const obj: ReDataModelDetails = {
                anomalies: new Map<string, Array<Anomaly>>(),
                schemaChanges: [],
                metrics: {
                    tableMetrics: new Map<string, Array<Metric>>(),
                    columnMetrics: new Map<string, Array<Metric>>()
                },
                tableSchema: [],
            }
            modelDetails.set(model, obj)
        }
    });
    groupAnomaliesByModel(overview, modelDetails)
    groupSchemaChangesByModel(overview, modelDetails);
    groupTableSchemaByModel(overview, modelDetails);
    groupMetricsByModel(overview, modelDetails);
    return modelDetails;
};

const Dashboard: React.FC = (): ReactElement => {
    const initialOverview: OverviewData = {
        anomalies: [],
        metrics: [],
        schema_changes: [],
        aggregated_models: new Map<string, ReDataModelDetails>(),
        table_schema: [],
        graph: null,
        generated_at: '',
    };
    const [reDataOverview, setReDataOverview] = useState<OverviewData>(initialOverview);
    const prepareOverviewData = async (): Promise<void> => {
        try {
            const response = await fetch(RE_DATA_OVERVIEW_FILE, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            const rawJson: Array<RawOverviewData> = await response.json();
            const data = rawJson[0];

            const overview: OverviewData = {
                anomalies: data.anomalies ? JSON.parse(data.anomalies as string) : [],
                metrics: data.metrics ? JSON.parse(data.metrics as string) : [],
                schema_changes: data.schema_changes ? JSON.parse(data.schema_changes as string) : [],
                aggregated_models: new Map<string, ReDataModelDetails>(),
                graph: JSON.parse(data.graph as string),
                table_schema: data.table_schema ? JSON.parse(data.table_schema) : [],
                generated_at: data.generated_at,
            }
            overview.aggregated_models = prepareModelDetails(overview);
            console.log(overview)
            setReDataOverview(overview);
        } catch (e) {
            console.log('Unable to load overview file');
            console.log(e);
        }
    };
    useEffect(() => {
        prepareOverviewData();
    }, []);

    return (
        <RedataOverviewContext.Provider value={reDataOverview}>
            <div className="relative min-h-screen md:flex" data-dev-hint="container">
                <Header/>
                <Sidebar/>

                <main id="content" className="flex-1 p-6 lg:px-8 bg-gray-100 max-h-screen overflow-y-auto">
                    <div className="max-w-full mx-auto h-full">
                        <div className="px-4 py-6 sm:px-0 h-full">
                            <Outlet/>
                        </div>
                    </div>
                </main>
            </div>
        </RedataOverviewContext.Provider>
    );
};

export default Dashboard;
