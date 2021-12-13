import React, { ReactElement, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as echarts from 'echarts/core';
import { LineChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  SingleAxisComponent,
  VisualMapComponent,
  MarkAreaComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import {
  extractComponentFromIdentifier,
} from '../utils/helpers';
import {
  ReDataModelDetails, Anomaly, Metric,
  OverviewData,
  RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import './ModelDetails.css';
import SchemaChanges from './SchemaChanges';
import MetricCharts from './MetricCharts';

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
    CanvasRenderer,
  ],
);

enum ModelTabs {
  ANOMALIES = 'anomalies',
  SCHEMA_CHANGES = 'schema_changes',
  METRICS = 'metrics'
}

const ModelDetails: React.FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(ModelTabs.ANOMALIES);

  const renderTab = (tab: ModelTabs, modelDetails: ReDataModelDetails): ReactElement => {
    if (tab === ModelTabs.METRICS) {
      return <MetricCharts modelDetails={modelDetails} showAnomalies={false} />;
    } if (tab === ModelTabs.ANOMALIES) {
      return <MetricCharts modelDetails={modelDetails} showAnomalies />;
    }
    return <SchemaChanges modelDetails={modelDetails} />;
  };

  let modelExists = false;
  const fullTableName = searchParams.get('model') as string;
  const overview: OverviewData = useContext(RedataOverviewContext);

  const showAnomalies = (): void => setActiveTab(ModelTabs.ANOMALIES);
  const showSchemaChanges = (): void => setActiveTab(ModelTabs.SCHEMA_CHANGES);
  const showMetrics = (): void => setActiveTab(ModelTabs.METRICS);

  let modelDetails: ReDataModelDetails = {
    anomalies: new Map<string, Array<Anomaly>>(),
    metrics: {
      tableMetrics: new Map<string, Array<Metric>>(),
      columnMetrics: new Map<string, Array<Metric>>(),
    },
    schemaChanges: [],
    tableSchema: [],
  };

  if (overview.aggregated_models.has(fullTableName)) {
    modelExists = true;
    modelDetails = overview.aggregated_models.get(fullTableName) as ReDataModelDetails;
  }

  return (
    <div className="col-span-4 h-auto overflow-scroll">
      <div className="bg-white rounded shadow border p-3">

        <div>
          <ul className="nav">
            <li
              className={activeTab === ModelTabs.METRICS ? 'active' : ''}
              role="presentation"
              onClick={showMetrics}
            >
              Metrics
            </li>
            <li
              className={activeTab === ModelTabs.ANOMALIES ? 'active' : ''}
              role="presentation"
              onClick={showAnomalies}
            >
              Anomalies
            </li>
            <li
              className={activeTab === ModelTabs.SCHEMA_CHANGES ? 'active' : ''}
              role="presentation"
              onClick={showSchemaChanges}
            >
              Schema
            </li>
          </ul>
          <div className="mb-2">
            <span
              className="text-2xl text--capitalize font-bold"
            >
              {extractComponentFromIdentifier(fullTableName, 'tableName')}
            </span>
          </div>
          <div className="outlet">
            {modelExists
              ? renderTab(activeTab, modelDetails)
              : <span>Click on node to show metrics, anomalies or schema changes</span>}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ModelDetails;
