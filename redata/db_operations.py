from sqlalchemy import create_engine
from redata import settings
from sqlalchemy.orm import sessionmaker

from redata import settings

def get_metrics_connection():
    db_string = settings.METRICS_DB_URL
    db = create_engine(db_string)
    return db

metrics_db = get_metrics_connection()

MetricsSession = sessionmaker(bind=metrics_db)
metrics_session = MetricsSession()
