from datetime import date, datetime, time

from sqlalchemy.sql import text

from redata.db_operations import metrics_db, metrics_session
from redata.metric import Metric


def check_data_volume(db, table, check, time_interval, conf):

    result = db.check_data_volume(table, time_interval, conf)
    return [result]
