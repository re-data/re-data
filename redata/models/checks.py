from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    Integer,
    String,
    JSON,
    BigInteger,
    Date,
    Float,
    Index,
    ARRAY,
)
from redata.models.base import Base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import ForeignKey
from datetime import datetime


class Check(Base):
    __tablename__ = "checks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(
        Integer, ForeignKey("monitored_table.id"), index=True, nullable=False
    )

    name = Column(String, nullable=False)

    metrics = Column(JSONB)

    query = Column(JSONB, nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True)

    def __str__(self):
        return self.name
