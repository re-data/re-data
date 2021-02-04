from redata.dags.schedule_checks import run_check_for_new_tables, run_checks, run_compute_alerts
from redata.grafana.grafana_setup import create_dashboards
from redata.db_operations import source_dbs
import argparse

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

    args = parser.parse_args()

    if not any((args.grafana, args.metrics)):
        print("Specify at least one of --grafana --metrics ")

    if args.grafana:
        create_dashboards()

    if args.metrics:

        for db in source_dbs:
            print ("run_check_for_new_table")
            run_check_for_new_tables(db)

            print("run_checks")
            run_checks(db)

            print ("run alerts")
            run_compute_alerts(db)


if __name__ == "__main__":
    main()