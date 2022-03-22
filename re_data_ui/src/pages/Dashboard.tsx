/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import dayjs from 'dayjs';
import React, { ReactElement, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  Alert, Anomaly, DbtGraph, ITableSchema, ITestSchema, Metric,
  OverviewData, ReDataModelDetails, RedataOverviewContext, SchemaChange, SelectOptionProps,
} from '../contexts/redataOverviewContext';
import {
  appendToMapKey, DBT_MANIFEST_FILE, generateMetricIdentifier,
  generateModelId,
  RE_DATA_OVERVIEW_FILE, stripQuotes, supportedResTypes,
} from '../utils';

interface RawOverviewData {
  type: 'alert' | 'metric' | 'schema_change' | 'schema' | 'test' | 'anomaly';
  table_name: string;
  column_name: string;
  computed_on: string;
  data: string;
}

type formatOverviewDataReturnType = {
  aggregatedModels: Map <string, ReDataModelDetails>,
  tests: ITestSchema[],
  failedTests: Record <string, ITestSchema[]>,
  runAts: Record <string, ITestSchema[]>,
  alerts: Alert[],
};

const formatOverviewData = (
  data: Array<RawOverviewData>,
): formatOverviewDataReturnType => {
  const result = new Map<string, ReDataModelDetails>();
  const alertsChanges: Alert[] = [];
  const tests: ITestSchema[] = [];

  const failedTestsObject: Record <string, ITestSchema[]> = {};
  const runAtObject: Record <string, ITestSchema[]> = {};
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
        tests: [],
        failedTests: {},
      };
      result.set(model, obj);
    }
    const columnName = item.column_name ? item.column_name : '';
    const details = result.get(model) as ReDataModelDetails;
    if (item.type === 'alert') {
      const alert = JSON.parse(item.data) as Alert;
      alertsChanges.push(alert);
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
    } else if (item.type === 'schema') {
      const schema = JSON.parse(item.data) as ITableSchema;
      schema.column_name = columnName;
      details.tableSchema.push(schema);
    } else if (item.type === 'test') {
      const schema = JSON.parse(item.data) as ITestSchema;
      const run_at = dayjs(schema.run_at).format('YYYY-MM-DD HH:mm:ss') as string;

      schema.column_name = columnName;
      schema.model = model;
      schema.run_at = run_at;

      details.tests.push(schema);
      runAtObject[run_at] = [...(runAtObject[run_at] || []), schema];
      if (schema.status?.toLowerCase() === 'fail') {
        failedTestsObject[model] = [...(failedTestsObject[model] || []), schema];
      }
      tests.push(schema);
    } else if (item.type === 'anomaly') {
      const anomaly = JSON.parse(item.data) as Anomaly;
      anomaly.column_name = columnName;
      appendToMapKey(details.anomalies, columnName, anomaly);
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
  alertsChanges.sort((a, b) => dayjs(b.time_window_end).diff(a.time_window_end));

  return {
    aggregatedModels: result,
    tests,
    failedTests: failedTestsObject,
    runAts: runAtObject,
    alerts: alertsChanges,
  };
};

const formatDbtData = (graphData: DbtGraph) => {
  const dbtMapping: Record<string, string> = {};
  const modelNodes: SelectOptionProps[] = [];
  Object.entries({ ...graphData.sources, ...graphData.nodes })
    .forEach(([key, value]) => {
      const { resource_type: resourceType, package_name: packageName } = value;

      if (supportedResTypes.has(resourceType) && packageName !== 're_data') {
        const modelId = generateModelId(value);
        dbtMapping[modelId] = key;
        modelNodes.push({
          value: modelId,
          label: modelId,
        });
      }
    });
  return { dbtMapping, modelNodes };
};

const Dashboard: React.FC = (): ReactElement => {
  const initialOverview: OverviewData = {
    alerts: [],
    aggregated_models: new Map<string, ReDataModelDetails>(),
    graph: null,
    generated_at: '',
    tests: [],
    loading: true,
    dbtMapping: {},
    modelNodes: [],
    failedTests: {},
    runAts: {},
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
        tests: [],
        aggregated_models: new Map<string, ReDataModelDetails>(),
        graph: null,
        generated_at: '',
        loading: false,
        dbtMapping: {},
        modelNodes: [],
        failedTests: {},
        runAts: {},
      };
      const {
        aggregatedModels,
        tests,
        failedTests,
        runAts,
        alerts,
      } = formatOverviewData(overviewData);

      const { dbtMapping, modelNodes } = formatDbtData(graphData);

      overview.aggregated_models = aggregatedModels;
      overview.alerts = alerts;
      overview.graph = graphData;
      overview.tests = tests;
      overview.dbtMapping = dbtMapping;
      overview.modelNodes = modelNodes;
      overview.failedTests = failedTests;
      overview.runAts = runAts;

      console.log('overview -> ', overview);
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
      <div className="relative min-h-screen md:flex overflow-hidden" data-dev-hint="container">
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
