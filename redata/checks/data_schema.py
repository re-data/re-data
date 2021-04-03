import json

from sqlalchemy import update
from sqlalchemy.sql import text

from redata.checks.create import create_for_detected_table
from redata.db_operations import metrics_session
from redata.metric import Metric
from redata.models.metrics import MetricFromCheck
from redata.models.table import Table


def schema_changed_record(operation, column_name, column_type, column_count, conf):
    return {
        Metric.SCHEMA_CHANGE: {
            "operation": operation,
            "column_name": column_name,
            "column_type": column_type,
            "column_count": column_count,
        }
    }


def check_for_new_tables(db, conf):
    results = []

    for namespace in db.namespaces:
        tables = db.table_names(namespace)

        monitored_tables = Table.get_all_tables_per_namespace(db.dbsource, namespace)
        monitored_tables_names = set([table.table_name for table in monitored_tables])

        for table_name in tables:
            if table_name not in monitored_tables_names:
                table = Table.setup_for_source_table(db, table_name, namespace)
                if table:
                    create_for_detected_table(db, table)
                    for check in table.checks:
                        if check.name == Metric.SCHEMA_CHANGE:
                            MetricFromCheck.add_metrics(
                                [
                                    schema_changed_record(
                                        "table detected", None, None, None, conf
                                    )
                                ],
                                check,
                                conf,
                            )


def check_if_schema_changed(db, table, check, conf):
    def schema_to_dict(schema):
        dct = {}

        for el in schema:
            nullable_part = " not null" if (el["nullable"] == False) else ""
            dct["name"] = el["type"] + nullable_part

        return dct

    def sorted_to_compare(schema):
        return sorted(schema, key=lambda x: sorted(x.items()))

    last_schema = table.schema["columns"]
    table_name = table.table_name
    results = []

    current_schema = db.get_table_schema(table.table_name, table.namespace)

    if sorted_to_compare(last_schema) != sorted_to_compare(current_schema):
        last_dict = schema_to_dict(last_schema)
        current_dict = schema_to_dict(current_schema)

        for el in last_dict:
            if el not in current_dict:
                print(f"{el} was removed from schema")
                results.append(
                    schema_changed_record(
                        "column removed", el, last_dict[el], len(current_dict), conf
                    )
                )

        for el in current_dict:
            if el not in last_dict:
                print(f"{el} was added to schema")
                results.append(
                    schema_changed_record(
                        "column added", el, current_dict[el], len(current_dict), conf
                    )
                )
            else:
                prev_type = last_dict[el]
                curr_type = current_dict[el]

                if curr_type != prev_type:
                    print(
                        f"Type of column: {el} changed from {prev_type} to {curr_type}"
                    )
                    results.append(
                        schema_changed_record(
                            "column changed",
                            el,
                            current_dict[el],
                            len(current_dict),
                            conf,
                        )
                    )

        table.schema = {"columns": current_schema}
        metrics_session.commit()

    return results
