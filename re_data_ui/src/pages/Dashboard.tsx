/* eslint-disable camelcase */
import dayjs from 'dayjs';
import React, { ReactElement, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  Alert,
  Anomaly,
  DbtGraph,
  DbtMacro,
  ITableSchema,
  ITestSchema,
  Metric,
  OverviewData,
  ReDataModelDetails,
  RedataOverviewContext,
  SchemaChange,
  SelectOptionProps,
} from '../contexts/redataOverviewContext';
import {
  appendToMapKey,
  DBT_MANIFEST_FILE,
  generateMetricIdentifier,
  generateModelId,
  PACKAGE_NAME,
  RE_DATA_OVERVIEW_FILE,
  stripQuotes,
  supportedResTypes,
} from '../utils';

interface RawOverviewData {
  type: 'alert' | 'metric' | 'schema_change' | 'schema' | 'test' | 'anomaly';
  table_name: string;
  column_name: string;
  computed_on: string;
  data: string;
}

type formatOverviewDataReturnType = {
  aggregatedModels: Map<string, ReDataModelDetails>;
  tests: ITestSchema[];
  failedTests: Record<string, ITestSchema[]>;
  runAts: Record<string, ITestSchema[]>;
  testsObject: Record<string, ITestSchema[]>;
  modelTestMapping: Record<string, ITestSchema[]>;
  alerts: Alert[];
};

const formatOverviewData = (
  data: Array<RawOverviewData>,
  result: Map<string, ReDataModelDetails>,
): formatOverviewDataReturnType => {
  // console.log('data -> ', data);
  const alertsChanges: Alert[] = [];
  const tests: ITestSchema[] = [];
  const testsObject: Record<string, ITestSchema[]> = {};
  const failedTestsObject: Record<string, ITestSchema[]> = {};
  const runAtObject: Record<string, ITestSchema[]> = {};
  const modelTestMapping: Record<string, ITestSchema[]> = {};
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
      // console.log('alert', item);
      const alert = JSON.parse(item.data) as Alert;
      alertsChanges.push(alert);
    } else if (item.type === 'metric') {
      const metric = JSON.parse(item.data) as Metric;
      metric.column_name = columnName;
      const key = generateMetricIdentifier(model, columnName, metric);
      if (columnName === '') {
        // table metric
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
      const run_at = dayjs(schema.run_at).format(
        'YYYY-MM-DD HH:mm:ss',
      ) as string;

      schema.column_name = columnName;
      schema.model = model;
      schema.run_at = run_at;

      details.tests.push(schema);
      if (
        Object.prototype.hasOwnProperty.call(
          modelTestMapping,
          schema?.test_name?.toLocaleLowerCase(),
        )
      ) {
        modelTestMapping[schema?.test_name?.toLocaleLowerCase()].push(schema);
      } else {
        modelTestMapping[schema?.test_name?.toLocaleLowerCase()] = [schema];
      }
      if (Object.prototype.hasOwnProperty.call(runAtObject, run_at)) {
        runAtObject[run_at].push(schema);
      } else {
        runAtObject[run_at] = [schema];
      }
      if (Object.prototype.hasOwnProperty.call(testsObject, model)) {
        testsObject[model].push(schema);
      } else {
        testsObject[model] = [schema];
      }
      if (
        schema.status?.toLowerCase() === 'fail'
        || schema.status?.toLowerCase() === 'error'
      ) {
        if (Object.prototype.hasOwnProperty.call(failedTestsObject, model)) {
          failedTestsObject[model].push(schema);
        } else {
          failedTestsObject[model] = [schema];
        }
      }

      // console.log('schema', schema);
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
    testsObject,
    failedTests: failedTestsObject,
    runAts: runAtObject,
    alerts: alertsChanges,
    modelTestMapping,
  };
};

const formatDbtData = (graphData: DbtGraph) => {
  const dbtMapping: Record<string, string> = {};
  const testNameMapping: Record<string, string> = {};
  const modelNodes: SelectOptionProps[] = [];

  const macros: Record<string, string> = {};
  const macrosOptions: SelectOptionProps[] = [];

  const modelNodesDepends: Record<string, string[]> = {};
  // const failedTestsObject: Record <string, ITestSchema[]> = {};
  const macroModelUsedIn: Record<string, string[]> = {};
  const macroDepends: Record<string, string[]> = {};

  // find a way to know where these macros exists
  for (const [key, value] of Object.entries(graphData.macros)) {
    const { package_name: packageName, depends_on: dependsOn } = value as DbtMacro;
    // console.log('key ', key, value.package_name || key === 're_data');
    if (packageName === PACKAGE_NAME || packageName === 're_data') {
      // console.log('key => ', key, 'dependsOn =>', dependsOn.macros);

      dependsOn.macros.map((macro: string) => {
        if (!Object.prototype.hasOwnProperty.call(macroDepends, macro)) {
          macroDepends[macro] = [key];
        } else {
          macroDepends[macro].push(key);
        }
        return true;
      });

      macros[key] = value as string;
      macrosOptions.push({
        value: key,
        label: key,
      });
    }
  }

  // console.log('reverse: ', macroDepends);
  // console.log('macros: ', Object.keys(macros));

  Object.entries({ ...graphData.sources, ...graphData.nodes }).forEach(
    ([key, value]) => {
      const {
        resource_type: resourceType,
        package_name: packageName,
        test_metadata: testMetadata,
        depends_on: dependsOn,
        name,
      } = value;
      const testMetadataName = testMetadata?.name as string;
      const modelId = generateModelId(value);
      const dependsOnMacros = dependsOn?.macros || [];

      // console.log('dependsOn ', dependsOnMacros);
      if (resourceType === 'test' && packageName !== 're_data') {
        testNameMapping[name?.toLowerCase()] = testMetadataName || name;
      }

      if (supportedResTypes.has(resourceType) && packageName !== 're_data') {
        dbtMapping[modelId] = key;
        modelNodes.push({
          value: modelId,
          label: modelId,
        });

        modelNodesDepends[modelId] = dependsOnMacros;
      }

      for (const [k] of Object.entries(macros)) {
        if (dependsOnMacros.includes(k)) {
          if (Object.prototype.hasOwnProperty.call(macroModelUsedIn, k)) {
            macroModelUsedIn[k].push(modelId);
          } else {
            macroModelUsedIn[k] = [modelId];
          }
        }
      }
    },
  );

  // console.log('macroModelUsedIn ', macroModelUsedIn);
  // console.log('modelNodesDepends ', modelNodesDepends);
  return {
    dbtMapping,
    modelNodes,
    macrosOptions,
    macroModelUsedIn,
    testNameMapping,
    modelNodesDepends,
    macroDepends,
    macros,
  };
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
    macrosOptions: [],
    failedTests: {},
    runAts: {},
    macros: {},
    testsObject: {},
    macroModelUsedIn: {},
    macroDepends: {},
    modelTestMapping: {},
    testNameMapping: {},
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
        macrosOptions: [],
        failedTests: {},
        runAts: {},
        macros: {},
        testsObject: {},
        modelTestMapping: {},
        testNameMapping: {},
        macroModelUsedIn: {},
        macroDepends: {},
      };
      const {
        dbtMapping,
        modelNodes,
        macrosOptions,
        testNameMapping,
        modelNodesDepends,
        macros,
        macroModelUsedIn,
        macroDepends,
      } = formatDbtData(graphData);
      const result = new Map<string, ReDataModelDetails>();
      for (const node of modelNodes) {
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
          runAts: {},
          macros: {},
        };
        result.set(node.value, obj);
      }
      const {
        aggregatedModels,
        tests,
        failedTests,
        testsObject,
        runAts,
        alerts,
        modelTestMapping,
      } = formatOverviewData(overviewData, result);

      overview.aggregated_models = aggregatedModels;
      overview.testsObject = testsObject;
      overview.alerts = alerts;
      overview.graph = graphData;
      overview.tests = tests;
      overview.dbtMapping = dbtMapping;
      overview.testNameMapping = testNameMapping;
      overview.modelNodes = modelNodes;
      overview.macros = macros;
      overview.macrosOptions = macrosOptions;
      overview.modelNodesDepends = modelNodesDepends;
      overview.macroModelUsedIn = macroModelUsedIn;
      overview.macroDepends = macroDepends;
      overview.failedTests = failedTests;
      overview.runAts = runAts;
      overview.modelTestMapping = modelTestMapping;

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
      <div
        className="relative min-h-screen md:flex overflow-hidden"
        data-dev-hint="container"
      >
        <Header />
        <Sidebar />

        <main
          id="content"
          className="flex-1 p-6 lg:px-8 bg-gray-100 max-h-screen overflow-y-auto"
        >
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
