import React, {ReactElement, useContext, useState} from "react";
import {useSearchParams} from "react-router-dom"
import {
    AggregatedAlerts,
    AggregatedMetrics, Anomaly, Metric,
    OverviewData,
    RedataOverviewContext, SchemaChange
} from "../contexts/redataOverviewContext";
import {
    extractComponentFromIdentifier,
} from "../utils/helpers";
import * as echarts from 'echarts/core';
import {LineChart, ScatterChart} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    SingleAxisComponent,
    VisualMapComponent,
    MarkAreaComponent,
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {UniversalTransition} from "echarts/features";
import './ModelDetails.css';
import SchemaChanges from "./SchemaChanges";
import MetricCharts from "./MetricCharts";

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

enum ModelTabs {
    ANOMALIES = 'anomalies',
    SCHEMA_CHANGES = 'schema_changes',
    METRICS = 'metrics'
}

const ModelDetails: React.FC = (): ReactElement => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(ModelTabs.ANOMALIES);

    const renderTab = (activeTab: ModelTabs, data: AggregatedMetrics, alerts: AggregatedAlerts): ReactElement => {
        if (activeTab === ModelTabs.METRICS) {
            return <MetricCharts data={data} alerts={alerts} showAnomalies={false}/>
        } else if (activeTab === ModelTabs.ANOMALIES) {
            return <MetricCharts data={data} alerts={alerts} showAnomalies={true}/>
        } else {
            return <SchemaChanges alerts={alerts}/>
        }
    }

    let modelExists = false;
    const fullTableName = searchParams.get('model');
    const overview: OverviewData = useContext(RedataOverviewContext);

    const showAnomalies = (): void => setActiveTab(ModelTabs.ANOMALIES);
    const showSchemaChanges = (): void => setActiveTab(ModelTabs.SCHEMA_CHANGES);
    const showMetrics = (): void => setActiveTab(ModelTabs.METRICS);

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

                <div>
                    <ul className="nav">
                        <li className={activeTab === ModelTabs.METRICS ? "active" : ""}
                            onClick={showMetrics}>Metrics
                        </li>
                        <li className={activeTab === ModelTabs.ANOMALIES ? "active" : ""}
                            onClick={showAnomalies}>Anomalies
                        </li>
                        <li className={activeTab === ModelTabs.SCHEMA_CHANGES ? "active" : ""}
                            onClick={showSchemaChanges}>Schema
                        </li>
                    </ul>
                    <div className="mb-2">
                    <span
                        className="text-2xl text--capitalize font-bold">{extractComponentFromIdentifier(fullTableName, 'tableName')}</span>
                    </div>
                    <div className="outlet">
                        {modelExists ? renderTab(activeTab, data, alerts) : <span>Click on node to show metrics, anomalies or schema changes</span>}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ModelDetails;
