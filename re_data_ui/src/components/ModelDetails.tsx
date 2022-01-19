import { LineChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent, MarkAreaComponent, SingleAxisComponent,
  TitleComponent, TooltipComponent, VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  OverviewData, ReDataModelDetails, RedataOverviewContext,
} from '../contexts/redataOverviewContext';
import useModel from '../hooks/useModel';
import {
  extractComponentFromIdentifier,
} from '../utils/helpers';
import MetricCharts from './MetricCharts';
import './ModelDetails.css';
import SchemaChanges from './SchemaChanges';
import TableSchema from './TableSchema';

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
  const { init } = useModel();
  const [modelDetails, setModelDetails] = useState<ReDataModelDetails>();

  const fullTableName = searchParams.get('model') as string;
  const overview: OverviewData = useContext(RedataOverviewContext);

  useEffect(() => {
    if (fullTableName && overview && !overview.loading) {
      const details = init(overview, fullTableName) as ReDataModelDetails;
      setModelDetails(details);
    }
  }, [fullTableName, overview.loading]);

  const showAnomalies = (): void => setActiveTab(ModelTabs.ANOMALIES);
  const showSchema = (): void => setActiveTab(ModelTabs.SCHEMA_CHANGES);
  const showMetrics = (): void => setActiveTab(ModelTabs.METRICS);

  const renderTab = (tab: ModelTabs): ReactElement => {
    if (modelDetails) {
      if (tab === ModelTabs.METRICS) {
        return <MetricCharts modelDetails={modelDetails} showAnomalies={false} />;
      } if (tab === ModelTabs.ANOMALIES) {
        return <MetricCharts modelDetails={modelDetails} showAnomalies />;
      }
      return (
        <>
          <TableSchema tableSchemas={modelDetails.tableSchema} />
          <SchemaChanges modelDetails={modelDetails} />
        </>
      );
    } return <></>;
  };

  return (
    <div className="col-span-4 h-auto overflow-y-auto">
      <div className="bg-white rounded shadow border p-3">

        <div>
          <ul className="transition ease-in-out delay-150 nav sticky top-0 bg-white z-10">
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
              onClick={showSchema}
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
            {modelDetails
              ? renderTab(activeTab)
              : <span>Click on node to show metrics, anomalies or schema changes</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
