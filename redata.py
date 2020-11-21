from redata.dags.schedule_checks import run_check_for_new_tables, run_checks
from redata.grafana.grafana_setup import create_dashboards
import argparse



if __name__ == "__main__":
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
        print("Specify at least one of --grafana --metrics")

    if args.grafana:
        create_dashboards()

    if args.metrics:
        print("run_checks")
        run_checks()

        print ("run_check_for_new_table")
        run_check_for_new_tables()