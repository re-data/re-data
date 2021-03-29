from datetime import datetime

from sqlalchemy import (
    ARRAY,
    JSON,
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

from redata.models.base import Base


class Check(Base):
    __tablename__ = "checks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(
        Integer, ForeignKey("monitored_table.id"), index=True, nullable=False
    )

    name = Column(String, nullable=False)

    metrics = Column(JSONB, nullable=False)

    query = Column(JSONB, nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True)

    def __str__(self):
        return self.name
