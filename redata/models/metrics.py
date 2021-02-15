from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, BigInteger, Date, Float, Index
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from sqlalchemy import Index
from sqlalchemy import ForeignKey


class MetricsDataDelay(Base):
    __tablename__ = 'metrics_data_delay'

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, index=True)
    value = Column(Integer)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)


class MetricsSchemaChanges(Base):
    __tablename__ = 'metrics_table_schema_changes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, index=True)
    column_name = Column(String)
    column_type = Column(String)
    column_count = Column(Integer)
    operation = Column(String)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)


class MetricsDataVolume(Base):
    __tablename__ = 'metrics_data_volume'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, index=True)
    time_interval = Column(String)
    count = Column(BigInteger)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)


class MetricsDataVolumeDiff(Base):
    __tablename__ = 'metrics_data_volume_diff'

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, index=True)
    date = Column(Date)
    count = Column(BigInteger)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, index=True, primary_key=True)


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

    
