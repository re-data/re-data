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
} from '../utils';
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

const arrow = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Information = () => (
  <section>
    <p className="font-medium p-3 text-center">Click on node to show metrics, anomalies or schema changes</p>
    <ul className="list-disc ml-4">
      <li className="text-sm">
        You can click on the graph legend (source, seed, anomaly..)
        to toggle showing only specific nodes.
      </li>
      <li className="text-sm mt-1">
        Once you select a node you can click on
        {' '}
        {arrow}
        {' '}
        to show the model table information
      </li>
    </ul>
  </section>
);

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
    } else {
      setModelDetails(undefined);
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
    <div className="col-span-4 h-auto overflow-y-auto bg-white border rounded shadow">
      <div className="p-3 pt-0">

        <div>
          <nav className="side-nav transition ease-in-out delay-150 sticky top-0 bg-white z-10">
            <ul className="">
              <li
                className={activeTab === ModelTabs.METRICS ? 'active-tab' : ''}
                role="presentation"
                onClick={showMetrics}
              >
                Metrics
              </li>
              <li
                className={activeTab === ModelTabs.ANOMALIES ? 'active-tab' : ''}
                role="presentation"
                onClick={showAnomalies}
              >
                Anomalies
              </li>
              <li
                className={activeTab === ModelTabs.SCHEMA_CHANGES ? 'active-tab' : ''}
                role="presentation"
                onClick={showSchema}
              >
                Schema
              </li>
            </ul>
          </nav>
          <p className="mb-2 text-center">
            <span
              className="text-2xl font-bold"
            >
              {extractComponentFromIdentifier(fullTableName, 'tableName')}
            </span>
          </p>
          <div className="outlet">
            {modelDetails
              ? renderTab(activeTab)
              : <Information />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
