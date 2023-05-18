/* eslint-disable camelcase */
import React from 'react';

export interface DbtNode {
  raw_sql: string;
  compiled_sql: string;
  resource_type: string;
  depends_on: {
    macros: string[];
    nodes: string[];
  };
  config: {
    enabled: boolean;
    alias: string | null;
    schema: string | null;
    database: string | null;
    tags: string[];
    meta: Record<string, unknown>;
    materialized: string;
    persist_docs: Record<string, unknown>;
    quoting: Record<string, unknown>;
    column_types: Record<string, unknown>;
    full_refresh: string | null;
    on_schema_change: string;
    'post-hook': [];
    'pre-hook': []
  };
  database: string;
  schema: string;
  fqn: string[];
  unique_id: string;
  package_name: string;
  root_path: string;
  path: string;
  original_file_path: string;
  name: string;
  alias: string;
  checksum: {
    name: string;
    checksum: string;
  };
  tags: [];
  refs: Array<Array<string>>;
  sources: [];
  description: string;
  columns: Record<string, unknown>;
  meta: Record<string, unknown>;
  docs: {
    show: boolean
  };
  patch_path: string;
  compiled_path: string | null;
  build_path: string | null;
  deferred: boolean;
  unrendered_config: Record<string, unknown>;
  created_at: number,
  test_metadata: Record<string, unknown>;
}

export interface DbtMacro {
  arguments: [];
  created_at: number;
  depends_on: {
    macros: string[];
  };
  description: string;
  docs: {
    show: boolean
  },
  macro_sql: string;
  meta: Record<string, unknown>;
  name: string;
  original_file_path: string;
  package_name: string;
  patch_path: string;
  path: string;
  resource_type: string;
  tags: [];
  unique_id: string;
}

export interface Anomaly {
  column_name: string;
  id: string;
  interval_length_sec: string;
  last_avg: string;
  last_stddev: string;
  last_value: string;
  metric: string;
  time_window_end: string;
  z_score_value: string;
}

export interface Metric {
  interval_length_sec: string;
  column_name: string;
  metric: string;
  time_window_end: string;
  value: string;
}

export interface DbtSource {
  columns: Record<string, unknown>;
  config: Record<string, unknown>;
  created_at: number;
  database: string;
  description: string;
  external: string | null;
  fqn: Array<string>;
  freshness: Record<string, unknown>;
  identifier: string;
  loaded_at_field: null;
  loader: string;
  meta: Record<string, unknown>;
  depends_on: {
    macros: string[];
    nodes: string[];
  };
  name: string;
  original_file_path: string;
  package_name: string;
  patch_path: string | null;
  path: string;
  quoting: {
    database: string | null, schema: string | null,
    identifier: string | null, column: string | null
  };
  relation_name: string;
  resource_type: string;
  root_path: string;
  schema: string;
  source_description: string;
  source_meta: Record<string, unknown>;
  source_name: string;
  tags: [];
  unique_id: string;
  unrendered_config: Record<string, unknown>;
  test_metadata: Record<string, unknown>;
}

export interface DbtGraph {
  exposures: Record<string, unknown>;
  nodes: { [key: string]: DbtNode };
  sources: { [key: string]: DbtSource };
  child_map: { [key: string]: [] };
  parent_map: { [key: string]: [] };
  macros: { [key: string]: unknown };
}

export interface TableSample {
  sample_data: string;
  sampled_on: string;
  table_name: string;
}

export interface MonitoredData {
  anomalyDetector: Record<string, string | number>,
  columns: Array<string>
  metrics: Record<string, Array<string>>,
  model: string,
  owners: Record<string, Record<string, string>>,
  timeFilter: string,
}

export interface TestData {
  column_name: string,
  compiled_sql?: string
  execution_time?: number | string,
  failures_count?: string,
  failures_json?: string,
  failures_table?: string,
  message?: string,
  run_at: string,
  run_at_2?: string,
  severity?: string,
  status: string,
  table_name: string,
  test_name: string,
  test_name_2?: string,
  additional_runtime_metadata?: string,
}

export interface MetaData {
  project_dict: {
    name: string,
    version: string,
    'config-version': number,
    profile: string,
    'target-path': string,
    'clean-targets': string[],
    'model-paths': string[],
    'on-run-end': string[],
    models: Record<string, unknown>,
    sources:Record<string, unknown>,
    seeds: Record<string, unknown>,
    vars: {
        're_data:anomaly_detector': Record<string, unknown>,
        're_data:owners_config': Record<string, unknown>,
        're_data:metrics_base': Record<string, unknown>,
    }
  },
  packages: {
    packages: Record<string, unknown>[]
  },
  version: string,
  generated_at: string,
  re_data_args?: Record<string, unknown>,
}

export interface AggregatedMetrics {
  tableMetrics: Map<string, Array<Metric>>;
  columnMetrics: Map<string, Array<Metric>>;
}

export interface ReDataModelDetails {
  anomalies: Map<string, Array<Anomaly>>;
  schemaChanges: Array<SchemaChange>;
  metrics: AggregatedMetrics;
  tableSchema: Array<ITableSchema>
  tests: Array<TestData>
  failedTests?: Record<string, unknown>;
  runAts?: Record<string, []>;
  macros?: Record<string, []>;
}

export interface SchemaChange {
  column_name: string;
  data_type: string | null;
  detected_time: string;
  id: string;
  is_nullable: string | null;
  operation: string;
  prev_column_name: string | null;
  prev_data_type: string | null;
  prev_is_nullable: string | null;
}

export interface ITestSchema {
  column_name: string;
  compiled_sql?: string;
  execution_time?: string;
  failures_count?: string;
  failures_json?: string;
  failures_table?: string;
  message?: string;
  severity?: string;
  status: string;
  test_name: string;
  model: string;
  run_at: string;
}

export interface ITableSchema {
  column_name: string;
  data_type: string;
  is_datetime: string;
  is_nullable: string;
}

export interface Alert {
  type: string;
  model: string;
  message: string;
  value: string;
  time_window_end: string;
}

export interface OverviewData {
  aggregated_models: Map<string, ReDataModelDetails>;
  alerts: Array<Alert>;
  dbtMapping: Record<string, string>;
  failedTests?: Record<string, TestData[]>;
  generated_at: string;
  graph: DbtGraph | null;
  loading: boolean;
  macroDepends?: Record<string, string[]>;
  macroModelUsedIn?: Record<string, string[]>;
  macros?: Record<string, unknown>;
  macrosOptions: SelectOptionProps[];
  metaData: MetaData | null;
  modelNodes: SelectOptionProps[];
  modelNodesDepends?: Record<string, string[]>;
  modelTestMapping: Record<string, TestData[]>;
  runAts?: Record<string, TestData[]>;
  testNameMapping: Record<string, string>;
  tests: Array<TestData>;
  testsObject: Record<string, TestData[]>;
  tableSamples: Map<string, TableSample>;
  monitoredData: Array<MonitoredData>;
}

export interface SelectOptionProps {
  value: string;
  label: string;
}

export interface NewOverviewData {
  type: 'alert' | 'metric' | 'schema_change' | 'schema';
  table_name: string;
  column_name: string;
  computed_on: string;
  data: string;
}

export const RedataOverviewContext = React.createContext<OverviewData>({
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
  modelNodesDepends: {},
  macroModelUsedIn: {},
  macroDepends: {},
  runAts: {},
  macros: {},
  testsObject: {},
  modelTestMapping: {},
  testNameMapping: {},
  tableSamples: new Map<string, TableSample>(),
  monitoredData: [],
});
