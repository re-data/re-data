from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, BigInteger, Date, Float, Index
from redata.db_operations import metrics_session
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from sqlalchemy import Index
from sqlalchemy import ForeignKey
from redata.metric import Metric


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
                    select_name = col + '_'  + m if col != Metric.TABLE_METRIC else m

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


    
