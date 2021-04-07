class Metric(object):
    COUNT = "count_rows"
    SCHEMA_CHANGE = "schema_change"
    DELAY = "delay"

    MAX = "max"
    MIN = "min"
    AVG = "avg"
    SUM = "sum"

    MAX_LENGTH = "max_length"
    MIN_LENGTH = "min_length"
    AVG_LENGTH = "avg_length"

    COUNT_NULLS = "count_nulls"
    COUNT_NOT_NULLS = "count_not_nulls"

    COUNT_EMPTY = "count_empty"
    COUNT_NOT_EMPTY = "count_not_empty"

    COUNT_NULLS_PR = "count_nulls_pr"
    COUNT_EMPTY_PR = "count_empty_pr"

    TABLE_METRICS = [COUNT, SCHEMA_CHANGE, DELAY]

    FOR_NUMERICAL_COL = [
        MAX,
        MIN,
        AVG,
        SUM,
        COUNT_NULLS,
        COUNT_NOT_NULLS,
        COUNT_NULLS_PR,
    ]

    FOR_TEXT_COL = [
        MAX_LENGTH,
        MIN_LENGTH,
        AVG_LENGTH,
        COUNT_NULLS,
        COUNT_EMPTY,
        COUNT_NOT_NULLS,
        COUNT_NOT_EMPTY,
        COUNT_NULLS_PR,
        COUNT_EMPTY_PR,
    ]

    TABLE_METRIC = "__table__metric__"
