import datetime

from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, JSON
from redata.models.base import Base
from redata.db_operations import metrics_session


class Run(Base):
    __tablename__ = 'run'

    id = Column(Integer, primary_key=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    for_date = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    status = Column(String, default="not started")

    run_type = Column(String, default="manual")


    @classmethod
    def get_not_started_run(cls):
        return (
            metrics_session.query(cls)
            .filter(cls.status == 'not started')
        ).first()

    @classmethod
    def get_pending_run(cls):
        return (
            metrics_session.query(cls)
            .filter(cls.status == 'pending')
        ).first()