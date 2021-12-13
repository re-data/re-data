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
  computed_on: string;
  id: string;
  interval_length_sec: number;
  last_avg: number;
  last_stddev: number;
  last_value: number;
  metric: string;
  table_name: string;
  time_window_end: string;
  z_score_value: number;
}

export interface Metric {
  column_name: string;
  computed_on: string;
  id: string;
  interval_length_sec: number;
  metric: string;
  table_name: string;
  time_window_end: string;
  time_window_start: string;
  value: number;
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
    identifier: string | null, column: string | null };
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

interface DbtGraph {
  exposures: Record<string, unknown>;
  nodes: { [key: string]: DbtNode };
  sources: { [key: string]: DbtSource };
}

export interface AggregatedMetrics {
  tableMetrics: Map<string, Array<Metric>>;
  columnMetrics: Map<string, Array<Metric>>;
}

export interface ReDataModelDetails {
  anomalies: Map<string, Array<Anomaly>>;
  schemaChanges: Array<SchemaChange>;
  metrics: AggregatedMetrics;
  tableSchema: Array<TableSchema>
}

export interface SchemaChange {
  column_name: string;
  data_type: string;
  detected_time: string;
  id: string;
  is_nullable: boolean;
  operation: string;
  prev_column_name: null;
  prev_data_type: null;
  prev_is_nullable: null;
  table_name: string;
}

export interface TableSchema {
  id: string;
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  is_datetime: string;
  time_filter: string;
}

export interface OverviewData {
  anomalies: Array<Anomaly>;
  metrics: Array<Metric>;
  schema_changes: Array<SchemaChange>;
  aggregated_models: Map<string, ReDataModelDetails>;
  graph: DbtGraph | null;
  table_schema: Array<TableSchema>;
  generated_at: string;
}

export const RedataOverviewContext = React.createContext<OverviewData>({
  anomalies: [],
  metrics: [],
  schema_changes: [],
  aggregated_models: new Map<string, ReDataModelDetails>(),
  graph: null,
  table_schema: [],
  generated_at: '',
});
