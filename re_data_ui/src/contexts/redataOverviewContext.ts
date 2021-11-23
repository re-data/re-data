import React from "react";

export interface DbtNode {
    "raw_sql": string;
    "resource_type": string;
    "depends_on": {
        "macros": string[];
        "nodes": string[];
    };
    "config": {
        "enabled": boolean;
        "alias": string | null;
        "schema": string | null;
        "database": string | null;
        "tags": string[];
        "meta": {};
        "materialized": string;
        "persist_docs": {};
        "quoting": {};
        "column_types": {};
        "full_refresh": string | null;
        "on_schema_change": string;
        "post-hook": [];
        "pre-hook": []
    };
    "database": string;
    "schema": string;
    "fqn": string[];
    "unique_id": string;
    "package_name": string;
    "root_path": string;
    "path": string;
    "original_file_path": string;
    "name": string;
    "alias": string;
    "checksum": {
        "name": string;
        "checksum": string;
    };
    "tags": [];
    "refs": Array<Array<string>>;
    "sources": [];
    "description": string;
    "columns": {};
    "meta": {};
    "docs": {
        "show": boolean
    };
    "patch_path": string;
    "compiled_path": string | null;
    "build_path": string | null;
    "deferred": boolean;
    "unrendered_config": {};
    "created_at": number
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
    columns: {};
    config: {};
    created_at: number;
    database: string;
    description: string;
    external: string | null;
    fqn: Array<string>;
    freshness: {};
    identifier: string;
    loaded_at_field: null;
    loader: string;
    meta: {};
    name: string;
    original_file_path: string;
    package_name: string;
    patch_path: string | null;
    path: string;
    quoting: { database: string | null, schema: string | null, identifier: string | null, column: string | null };
    relation_name: string;
    resource_type: string;
    root_path: string;
    schema: string;
    source_description: string;
    source_meta: {};
    source_name: string;
    tags: [];
    unique_id: string;
    unrendered_config: {};
}

interface DbtGraph {
    exposures: object;
    nodes: { [key: string]: DbtNode };
    sources: { [key: string]: DbtSource };
}

export interface AggregatedMetrics {
    tableMetrics: Map<string, Array<Metric>>;
    columnMetrics: Map<string, Array<Metric>>;
}

export interface OverviewData {
    anomalies: Array<Anomaly>;
    metrics: Array<Metric>;
    aggregated_metrics: Map<string, AggregatedMetrics>;
    graph: DbtGraph | null;
    generated_at: string;
}

export const RedataOverviewContext = React.createContext<OverviewData>({
    anomalies: [],
    metrics: [],
    aggregated_metrics: new Map<string, AggregatedMetrics>(),
    graph: null,
    generated_at: '',
});
