import React, { ReactElement, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  ReDataModelDetails, Anomaly,
  Metric,
  OverviewData,
  RedataOverviewContext, SchemaChange, ITableSchema, Alert, DbtGraph,
} from '../contexts/redataOverviewContext';
import {
  appendToMapKey, generateMetricIdentifier, RE_DATA_OVERVIEW_FILE, stripQuotes, DBT_MANIFEST_FILE,
} from '../utils/helpers';

interface RawOverviewData {
  type: 'alert' | 'metric' | 'schema_change' | 'schema';
  // eslint-disable-next-line camelcase
  table_name: string;
  // eslint-disable-next-line camelcase
  column_name: string;
  // eslint-disable-next-line camelcase
  computed_on: string;
  data: string;
}

const formatOverviewData = (
  data: Array<RawOverviewData>,
): [Map<string, ReDataModelDetails>, Alert[]] => {
  const result = new Map<string, ReDataModelDetails>();
  const alertsAndSchemaChanges: Alert[] = [];
  data.forEach((item: RawOverviewData) => {
    if (!item.table_name) return;
    const model = stripQuotes(item.table_name).toLowerCase();
    if (!result.has(model)) {
      const obj: ReDataModelDetails = {
        anomalies: new Map<string, Array<Anomaly>>(),
        schemaChanges: [],
        metrics: {
          tableMetrics: new Map<string, Array<Metric>>(),
          columnMetrics: new Map<string, Array<Metric>>(),
        },
        tableSchema: [],
      };
      result.set(model, obj);
    }
    const columnName = item.column_name ? item.column_name : '';
    const details = result.get(model) as ReDataModelDetails;
    if (item.type === 'alert') {
      const anomaly = JSON.parse(item.data) as Anomaly;
      anomaly.column_name = columnName;
      appendToMapKey(details.anomalies, columnName, anomaly);
      alertsAndSchemaChanges.push({ type: 'anomaly', model, value: anomaly });
    } else if (item.type === 'metric') {
      const metric = JSON.parse(item.data) as Metric;
      metric.column_name = columnName;
      const key = generateMetricIdentifier(model, columnName, metric);
      if (columnName === '') { // table metric
        appendToMapKey(details.metrics.tableMetrics, key, metric);
      } else {
        appendToMapKey(details.metrics.columnMetrics, key, metric);
      }
    } else if (item.type === 'schema_change') {
      const schemaChange = JSON.parse(item.data) as SchemaChange;
      schemaChange.column_name = columnName;
      details.schemaChanges.push(schemaChange);
      alertsAndSchemaChanges.push({ type: 'schema_change', model, value: schemaChange });
    } else if (item.type === 'schema') {
      const schema = JSON.parse(item.data) as ITableSchema;
      schema.column_name = columnName;
      details.tableSchema.push(schema);
    }
  });
  // loop through each table/model and sort by ascending order by
  // time_window_end for table and column metrics
  for (const metricMap of result.values()) {
    for (const [key, metrics] of metricMap.metrics.tableMetrics) {
      const sortedMetrics = metrics.sort(
        (a: Metric, b: Metric) => dayjs(a.time_window_end).diff(b.time_window_end),
      );
      metricMap.metrics.tableMetrics.set(key, sortedMetrics);
    }
    for (const [key, metrics] of metricMap.metrics.columnMetrics) {
      const sortedMetrics = metrics.sort(
        (a: Metric, b: Metric) => dayjs(a.time_window_end).diff(b.time_window_end),
      );
      metricMap.metrics.columnMetrics.set(key, sortedMetrics);
    }
  }
  alertsAndSchemaChanges.sort((a, b) => {
    const x = a.type === 'anomaly' ? (a.value as Anomaly).time_window_end : (a.value as SchemaChange).detected_time;
    const y = b.type === 'anomaly' ? (b.value as Anomaly).time_window_end : (b.value as SchemaChange).detected_time;
    return dayjs(y).diff(x);
  });
  return [result, alertsAndSchemaChanges];
};

const Dashboard: React.FC = (): ReactElement => {
  const initialOverview: OverviewData = {
    alerts: [],
    aggregated_models: new Map<string, ReDataModelDetails>(),
    graph: null,
    generated_at: '',
  };
  const [reDataOverview, setReDataOverview] = useState<OverviewData>(initialOverview);
  const prepareOverviewData = async (): Promise<void> => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    try {
      const [overviewRequest, dbtManifestRequest] = await Promise.all([
        fetch(RE_DATA_OVERVIEW_FILE, { headers }),
        fetch(DBT_MANIFEST_FILE, { headers }),
      ]);
      const overviewData: Array<RawOverviewData> = await overviewRequest.json();
      const graphData: DbtGraph = await dbtManifestRequest.json();

      const overview: OverviewData = {
        alerts: [],
        aggregated_models: new Map<string, ReDataModelDetails>(),
        graph: null,
        generated_at: '',
      };
      const [aggregatedModels, alerts] = formatOverviewData(overviewData);
      overview.aggregated_models = aggregatedModels;
      overview.alerts = alerts;
      overview.graph = graphData;
      console.log(overview);
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
        <Header />
        <Sidebar />

        <main id="content" className="flex-1 p-6 lg:px-8 bg-gray-100 max-h-screen overflow-y-auto">
          <div className="max-w-full mx-auto h-full">
            <div className="px-4 py-6 sm:px-0 h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </RedataOverviewContext.Provider>
  );
};

export default Dashboard;
