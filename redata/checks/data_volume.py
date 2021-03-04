from redata.db_operations import metrics_session, metrics_db
from sqlalchemy.sql import text
from datetime import datetime, date, time
from redata.metric import Metric


def check_data_volume(db, table, check, time_interval, conf):

    result = db.check_data_volume(table, time_interval, conf)
    return [result]
