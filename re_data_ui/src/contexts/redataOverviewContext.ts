/* eslint-disable camelcase */
import React from 'react';

export interface DbtNode {
  raw_sql: string;
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
  created_at: number
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
}

export interface DbtGraph {
  exposures: Record<string, unknown>;
  nodes: { [key: string]: DbtNode };
  sources: { [key: string]: DbtSource };
  child_map: { [key: string]: [] };
  parent_map: { [key: string]: [] };
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
  tests: Array<ITestSchema>
  failedTests?: Record<string, unknown>;
  runAts?: Record<string, []>;
  // testsObject: Record<string, unknown>;
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
  alerts: Array<Alert>;
  tests: Array<ITestSchema>;
  aggregated_models: Map<string, ReDataModelDetails>;
  graph: DbtGraph | null;
  generated_at: string;
  loading: boolean;
  dbtMapping: Record<string, string>;
  modelNodes: SelectOptionProps[];
  failedTests?: Record<string, ITestSchema[]>;
  runAts?: Record<string, ITestSchema[]>;
  testsObject: Record<string, ITestSchema[]>;
  modelTestMapping: Record<string, ITestSchema[]>;
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
  generated_at: '',
  tests: [],
  loading: true,
  dbtMapping: {},
  modelNodes: [],
  runAts: {},
  testsObject: {},
  modelTestMapping: {},
});
