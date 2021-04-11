from redata.checks.data_schema import check_for_new_tables
from redata.db_operations import metrics_db, metrics_session
from redata.metric import Metric
from redata.models.metrics import MetricFromCheck
from redata.utils import name_for


def count_nulls_pr(column, result):
    nulls = result[name_for(column, Metric.COUNT_NULLS)]
    not_nulls = result[name_for(column, Metric.COUNT_NOT_NULLS)]
    if nulls + not_nulls == 0:
        return None

    return nulls * 100.0 / (nulls + not_nulls)


def count_empty_pr(column, result):
    empty = (result[name_for(column, Metric.COUNT_EMPTY)],)
    not_empty = result[name_for(column, Metric.COUNT_NOT_EMPTY)]
    if empty + not_empty == 0:
        return None

    return empty * 100.0 / (empty + not_empty)


DERIVED_METRICS = {
    Metric.COUNT_NULLS_PR: {
        "requires": [Metric.COUNT_NULLS, Metric.COUNT_NOT_NULLS],
        "func": count_nulls_pr,
    },
    Metric.COUNT_EMPTY_PR: {
        "requires": [Metric.COUNT_EMPTY, Metric.COUNT_NOT_EMPTY],
        "func": count_nulls_pr,
    },
}


def check_column_values(db, table, check, time_interval, conf):

    result = db.check_column_values(table, check.metrics, time_interval, conf)

    for column, metrics in check.metrics.items():
        for metric in metrics:
            if metric in DERIVED_METRICS:

                func = DERIVED_METRICS[metric]["func"]
                requires = DERIVED_METRICS[metric]["requires"]

                all_requires = [name_for(column, m) in result for m in requires]

                if all(all_requires):
                    result[name_for(column, metric)] = func(column, result)

    return [result]
