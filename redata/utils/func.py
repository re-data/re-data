from redata.metric import Metric


def name_for(col, metric):
    if col == Metric.TABLE_METRIC:
        return metric
    else:
        return col + ":" + metric
