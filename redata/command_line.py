from redata.dags.schedule_checks import run_check_for_new_tables, run_checks, run_compute_alerts
from redata.grafana.grafana_setup import create_dashboards
from redata.sample_data.generate import create_sample_tables_in_redata
from redata.db_operations import source_dbs
import argparse
from datetime import datetime, timedelta
from redata.conf import Conf

def main():
    parser = argparse.ArgumentParser(
        description="Either create dashboards in grafana or run manual data ingestion of data metrics"
    )

    parser.add_argument(
        "--grafana", action="store_true", help="Setup grafana dashboards, based on existing metrics"
    )
    parser.add_argument(
        "--metrics", action="store_true", help="Push metrics to redata"
    )

    parser.add_argument(
        "--generate-sample-data", action="store_true", help="Add sample data to REDATA DB for demonstration"
    )

    parser.add_argument(
        "--backfill", dest='backfill_days', action="store", nargs='?', type=int, help="Run backfill for last X days of metrics data"
    )

    args = parser.parse_args()

    if not any((args.grafana, args.metrics, args.backfill_days, args.generate_sample_data)):
        print("Specify at least one of --grafana --metrics ")

    if args.grafana:
        create_dashboards()

    if args.metrics:

        for db in source_dbs:
            print ("run_check_for_new_table")
            run_check_for_new_tables(db, Conf(datetime.utcnow()))

            print("run_checks")
            run_checks(db, Conf(datetime.utcnow()))

            print ("run alerts")
            run_compute_alerts(db, Conf(datetime.utcnow()))

    if args.generate_sample_data:
        create_sample_tables_in_redata()


    if args.backfill_days:
        days = args.backfill_days
        
        for db in source_dbs:
            run_check_for_new_tables(db, Conf(datetime.utcnow()))
            past = datetime.utcnow() - timedelta(days=days)

            while past <= datetime.utcnow():
                run_checks(db, Conf(past))

                run_compute_alerts(db, Conf(past))
                
                past += timedelta(days=1)


if __name__ == "__main__":
    main()