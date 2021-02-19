from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, BigInteger, Date, Float, Index
from redata.db_operations import metrics_session
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from sqlalchemy import Index
from sqlalchemy import ForeignKey


class MetricsDataValues(Base):
    __tablename__ = 'metrics_data_values'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, index=True)

    column_name = Column(String)
    column_value = Column(String)
    check_name = Column(String)
    check_value = Column(Float)
    time_interval = Column(String)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)


class Metric(object):
    COUNT = 'count_rows'
    SCHEMA_CHANGE = 'schema_change'
    DELAY = 'delay'

    MAX = 'max'
    MIN = 'min'
    AVG = 'avg'
    SUM = 'sum'

    EMPTY = 'empty'
    EMPTY_PR = 'empty_pr'

    MAX_LENGTH = 'max_length'
    MIN_LENGTH = 'min_length'
    AVG_LENGTH = 'avg_length'

    COUNT_NULLS = 'count_nulls'
    COUNT_EMPTY = 'count_empty'

    FOR_NUMERICAL_COL = [
        MAX, MIN, MAX, SUM,
        EMPTY
    ]

    FOR_TEXT_COL = [
        MAX_LENGTH, MIN_LENGTH, AVG_LENGTH,
        EMPTY
    ]

    TABEL_METRIC = '__table__metric__'


class MetricFromCheck(Base):
    __tablename__ = 'metric'

    id = Column(Integer, primary_key=True, autoincrement=True)
    check_id = Column(Integer, ForeignKey('checks.id'), index=True)
    table_id = Column(Integer, ForeignKey('monitored_table.id'), index=True)
    table_column = Column(String)

    metric = Column(String)
    params = Column(JSONB)
    result = Column(JSONB)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)

    @classmethod
    def add_metrics(cls, results, check, conf):

        print (results, check.metrics, check.metrics, check.name)
        for row in results:
            
            for col, metrics in check.metrics.items():

                for m in metrics:
                    select_name = col + '_'  + m if col != Metric.TABEL_METRIC else m

                    m = MetricFromCheck(
                        check_id=check.id,
                        table_id=check.table.id,
                        table_column=col if col else None,
                        params=check.query['params'],
                        metric=m,
                        result={
                            'value': row[select_name]
                        },
                        created_at=conf.for_time
                    )
                    metrics_session.add(m)
            
            metrics_session.commit()


    
