from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, JSON
from datetime import datetime


class Alert(Base):
    __tablename__  = 'alerts_alert'

    id = Column(Integer, primary_key=True)

    text = Column(String)
    severity = Column(Integer)
    table_id = Column(Integer)
    alert_type = Column(String)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    