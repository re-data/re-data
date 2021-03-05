from datetime import datetime

from sqlalchemy import JSON, TIMESTAMP, Boolean, Column, ForeignKey, Integer, String

from redata.models.base import Base


class Alert(Base):
    __tablename__ = "alerts_alert"

    id = Column(Integer, primary_key=True)

    text = Column(String)
    severity = Column(Integer)
    table_id = Column(Integer, ForeignKey("monitored_table.id"))
    alert_type = Column(String)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True)
