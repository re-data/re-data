from datetime import datetime

from sqlalchemy import (
    TIMESTAMP,
    BigInteger,
    Boolean,
    Column,
    Date,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import JSONB

from redata.db_operations import metrics_session
from redata.metric import Metric
from redata.models.base import Base
from redata.utils import name_for


class MetricFromCheck(Base):
    __tablename__ = "metric"

    id = Column(Integer, primary_key=True, autoincrement=True)
    check_id = Column(Integer, ForeignKey("checks.id", ondelete="CASCADE"), index=True)
    table_id = Column(
        Integer, ForeignKey("monitored_table.id", ondelete="CASCADE"), index=True
    )
    table_column = Column(String, index=True)

    metric = Column(String, index=True)
    params = Column(JSONB)
    result = Column(JSONB)

    created_at = Column(
        TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True
    )

    def __str__(self):
        return f"{self.metric}.{self.result}"

    @classmethod
    def add_metrics(cls, results, check, conf):

        print(f"Adding results for check: {check}")
        for row in results:

            for col, metrics in check.metrics.items():

                for m in metrics:
                    select_name = name_for(col, m)

                    m = MetricFromCheck(
                        check_id=check.id,
                        table_id=check.table.id,
                        table_column=col,
                        params=check.query.get("params", {}),
                        metric=m,
                        result={"value": row[select_name]},
                        created_at=conf.for_time,
                    )
                    metrics_session.add(m)

            metrics_session.commit()
