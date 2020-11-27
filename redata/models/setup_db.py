from redata.db_operations import metrics_db
from redata.models.base import Base
from redata.checks.data_schema import check_for_new_tables
from redata.setup_checks import setup_metrics


def setup():
    from redata.models.table import MonitoredTable
    
    Base.metadata.create_all(metrics_db)
    setup_metrics()

    print ("Created metrics tables")