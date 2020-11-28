from redata.dags.schedule_checks import run_check_for_new_tables, run_checks
from redata.grafana.grafana_setup import create_dashboards
from redata.models.setup_db import setup
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
    parser.add_argument(
        "--tables", action="store_true", help="Create information about tables to be observed"
    )

    args = parser.parse_args()

    if not any((args.grafana, args.metrics, args.tables)):
        print("Specify at least one of --grafana --metrics --tables")

    if args.tables:
        setup()

    if args.grafana:
        create_dashboards()

    if args.metrics:
        print ("run_check_for_new_table")
        run_check_for_new_tables()

        print("run_checks")
        run_checks()


if __name__ == "__main__":
    main()