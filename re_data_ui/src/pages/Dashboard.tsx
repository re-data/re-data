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
  MetaData,
  Metric,
  OverviewData,
  ReDataModelDetails,
  RedataOverviewContext,
  SchemaChange,
  SelectOptionProps,
  TableSample,
  TestData,
} from '../contexts/redataOverviewContext';
import {
  appendToMapKey,
  DBT_MANIFEST_FILE,
  generateMetricIdentifier,
  generateModelId,
  METADATA_FILE,
  PROJECT_NAME,
  RE_DATA_OVERVIEW_FILE,
  stripQuotes,
  supportedResTypes,
  TABLE_SAMPLE_FILE,
  TEST_FILE,
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
  alerts: Alert[];
};

const formatOverviewData = (
  data: Array<RawOverviewData>,
  result: Map<string, ReDataModelDetails>,
): formatOverviewDataReturnType => {
  const alertsChanges: Alert[] = [];

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
    alerts: alertsChanges,
  };
};

const formatDbtData = (graphData: DbtGraph, PACKAGE_NAME: string) => {
  const dbtMapping: Record<string, string> = {};
  const testNameMapping: Record<string, string> = {};
  const modelNodes: SelectOptionProps[] = [];

  const macros: Record<string, string> = {};
  const macrosOptions: SelectOptionProps[] = [];

  const modelNodesDepends: Record<string, string[]> = {};
  const macroModelUsedIn: Record<string, string[]> = {};
  const macroDepends: Record<string, string[]> = {};

  // find a way to know where these macros exists
  for (const [key, value] of Object.entries(graphData.macros)) {
    const { package_name: packageName, depends_on: dependsOn } = value as DbtMacro;
    if (packageName === PACKAGE_NAME || packageName === PROJECT_NAME) {
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

      if (resourceType === 'test' && packageName !== PROJECT_NAME) {
        testNameMapping[name?.toLowerCase()] = testMetadataName || name;
      }

      if (supportedResTypes.has(resourceType) && packageName !== PROJECT_NAME) {
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

type formatTestDataProps = {
  tests: TestData[];
  failedTests: Record<string, TestData[]>;
  runAts: Record<string, TestData[]>;
  testsObject: Record<string, TestData[]>;
  modelTestMapping: Record<string, TestData[]>;
};

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

const formatTestData = (tests: Array<TestData>): formatTestDataProps => {
  const testsObject: Record<string, TestData[]> = {};
  const failedTests: Record<string, TestData[]> = {};
  const runAts: Record<string, TestData[]> = {};
  const modelTestMapping: Record<string, TestData[]> = {};

  const testData: TestData[] = [];

  for (let index = 0; index < tests.length; index++) {
    const element = tests[index];
    const run_at = dayjs(element.run_at).format(
      dateTimeFormat,
    ) as string;

    testData.push({
      ...element,
      run_at,
    });

    const model = stripQuotes(element.table_name).toLowerCase();

    if (
      Object.prototype.hasOwnProperty.call(
        modelTestMapping,
        element?.test_name?.toLocaleLowerCase(),
      )
    ) {
      modelTestMapping[element?.test_name?.toLocaleLowerCase()].push(element);
    } else {
      modelTestMapping[element?.test_name?.toLocaleLowerCase()] = [element];
    }

    if (Object.prototype.hasOwnProperty.call(runAts, run_at)) {
      runAts[run_at].push(element);
    } else {
      runAts[run_at] = [element];
    }
    if (Object.prototype.hasOwnProperty.call(testsObject, model)) {
      testsObject[model].push(element);
    } else {
      testsObject[model] = [element];
    }
    if (
      element.status?.toLowerCase() === 'fail'
      || element.status?.toLowerCase() === 'error'
    ) {
      if (Object.prototype.hasOwnProperty.call(failedTests, model)) {
        failedTests[model].push(element);
      } else {
        failedTests[model] = [element];
      }
    }
  }

  return {
    tests: testData,
    testsObject,
    failedTests,
    runAts,
    modelTestMapping,
  };
};

const Dashboard: React.FC = (): ReactElement => {
  const initialOverview: OverviewData = {
    alerts: [],
    aggregated_models: new Map<string, ReDataModelDetails>(),
    graph: null,
    metaData: null,
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
    tableSamples: new Map<string, TableSample>(),
  };
  const [reDataOverview, setReDataOverview] = useState<OverviewData>(initialOverview);
  const prepareOverviewData = async (): Promise<void> => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    try {
      const [
        overviewRequest,
        dbtManifestRequest,
        testRequest,
        metadataRequest,
        tableSamplesRequest,
      ] = await Promise.all([
        fetch(RE_DATA_OVERVIEW_FILE, { headers }),
        fetch(DBT_MANIFEST_FILE, { headers }),
        fetch(TEST_FILE, { headers }),
        fetch(METADATA_FILE, { headers }),
        fetch(TABLE_SAMPLE_FILE, { headers }),
      ]);
      const overviewData: Array<RawOverviewData> = await overviewRequest.json();
      const graphData: DbtGraph = await dbtManifestRequest.json();
      const metaData: MetaData = await metadataRequest.json();
      const testData: Array<TestData> = await testRequest.json();
      const tableSamples = await tableSamplesRequest.json();
      // const tableSamples: Array<TableSample> = await tableSamplesRequest.json();
      console.log('tableSamples ', tableSamples);

      const tableSamplesData = new Map<string, TableSample>();

      for (let index = 0; index < tableSamples.length; index++) {
        let { table_name, sampled_on, sample_data } = tableSamples[index];
        table_name = table_name.replaceAll('"', '');
        sampled_on = dayjs(sampled_on).format(dateTimeFormat);
        sample_data = JSON.parse(sample_data);

        tableSamplesData.set(table_name, { table_name, sampled_on, sample_data });
        // console.log('element', element, JSON.parse(element.table_name));
        // console.log('element', element);
      }
      console.log('tableSamplesData', tableSamplesData);

      const {
        tests, failedTests, testsObject, runAts, modelTestMapping,
      } = formatTestData(testData);

      const overview: OverviewData = {
        alerts: [],
        tests: [],
        aggregated_models: new Map<string, ReDataModelDetails>(),
        graph: null,
        metaData,
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
        tableSamples: new Map<string, TableSample>(),
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
      } = formatDbtData(graphData, metaData?.project_dict?.name);
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
      const { aggregatedModels, alerts } = formatOverviewData(
        overviewData,
        result,
      );

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
      overview.tableSamples = tableSamplesData;

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
