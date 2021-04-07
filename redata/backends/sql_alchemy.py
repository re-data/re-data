from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import Date, Interval, case, cast, desc, distinct, func, select, text
from sqlalchemy.schema import MetaData

from redata.backends.base import DB
from redata.metric import Metric


class SqlAlchemy(DB):

    METRIC_TO_FUNC = {
        Metric.MAX: func.max,
        Metric.MIN: func.min,
        Metric.AVG: func.avg,
        Metric.SUM: func.sum,
        Metric.COUNT_NULLS: lambda x: func.sum(case([(x == None, 1)], else_=0)),
        Metric.MAX_LENGTH: lambda x: func.max(func.length(x)),
        Metric.MIN_LENGTH: lambda x: func.min(func.length(x)),
        Metric.AVG_LENGTH: lambda x: func.avg(func.length(x)),
        Metric.COUNT_EMPTY: lambda x: func.sum(
            case([(x == None, 1), (x == "", 1)], else_=0)
        ),
    }

    def __init__(self, dbsource, db, schema=None):
        super().__init__(dbsource, db, schema)

    def get_table_obj(self, table):
        if not getattr(self, "_per_namespace", None):
            self._per_namespace = {}
            for namespace in self.namespaces:
                metadata = MetaData(schema=namespace)
                metadata.reflect(bind=self.db)
                self._per_namespace[namespace] = metadata

        return self._per_namespace[table.namespace].tables[table.full_table_name]

    def table_names(self, namespace):
        return self.db.table_names(namespace)

    def filtered_by_time(self, stmt, table, interval, conf):
        q_table = self.get_table_obj(table)

        start = self.get_time_to_compare(interval, conf.for_time)
        stop = self.get_timestamp(conf.for_time)

        stmt = stmt.where(
            (q_table.c[table.time_column] > start)
            & (q_table.c[table.time_column] < stop)
        )
        return stmt

    def check_data_volume(self, table, time_interval, conf):
        q_table = self.get_table_obj(table)
        stmt = select([func.count().label(Metric.COUNT)]).select_from(q_table)

        stmt = self.filtered_by_time(stmt, table, time_interval, conf)
        result = self.db.execute(stmt).first()

        return result

    def get_timestamp(self, from_time):
        return from_time

    def to_naive_timestamp(self, from_time):
        return from_time

    def check_data_delayed(self, table, conf):

        q_table = self.get_table_obj(table)

        stmt = select(
            [func.max(q_table.c[table.time_column]).label("max_time")]
        ).select_from(q_table)

        stmt = stmt.where(
            q_table.c[table.time_column] < self.get_timestamp(conf.for_time)
        )

        result = self.db.execute(stmt).first()

        if result[0] is None:
            return [None]

        result_time = self.to_naive_timestamp(result.max_time)

        return [conf.for_time - result_time]

    def check_column_values(self, table, metrics, time_interval, conf):

        q_table = self.get_table_obj(table)

        to_select = []
        for column, checks in metrics.items():
            for check in checks:
                if check in self.METRIC_TO_FUNC:
                    func = self.METRIC_TO_FUNC[check]
                    select_item = func(q_table.c[column]).label(column + ":" + check)
                    to_select.append(select_item)

        if not to_select:
            return []

        stmt = select(to_select).select_from(q_table)

        stmt = self.filtered_by_time(stmt, table, time_interval, conf)
        result = dict(self.db.execute(stmt).first())

        for key, val in result.items():
            if type(val) == Decimal:
                result[key] = float(val)

        return result

    def check_count_per_value(self, table, checked_column, time_interval, conf):

        q_table = self.get_table_obj(table)

        column = q_table.c[checked_column]

        stmt = select([func.count(distinct(column)).label("count")]).select_from(
            q_table
        )

        stmt = self.filtered_by_time(stmt, table, time_interval, conf)

        result = self.db.execute(stmt).first()

        if result.count > 10:
            return None

        stmt = select(
            [func.count().label("count"), (column).label("value")]
        ).select_from(q_table)

        stmt = self.filtered_by_time(stmt, table, time_interval, conf)
        stmt = stmt.where((column != None))

        stmt = stmt.group_by(column).order_by(desc("count")).limit(10)

        result = self.db.execute(stmt).fetchall()

        return result

    def get_table_schema(self, table_name, namespace):
        schema_check = f"and table_schema = '{namespace}'" if namespace else ""
        result = self.db.execute(
            f"""
            SELECT 
                column_name as name, 
                data_type as type,
                is_nullable as nullable
            FROM 
                information_schema.columns
            WHERE 
                table_name = '{table_name}'
                {schema_check}
        """
        )
        return [dict(x) for x in result]
