from redata.db_operations import metrics_db
from redata.models.base import Base
from redata.checks.data_schema import check_for_new_tables


def setup():
    from redata.models.table import MonitoredTable
    from redata.checks.data_schema import check_for_new_tables
    
    Base.metadata.create_all(metrics_db)
    check_for_new_tables()

    print ("Created metrics tables")