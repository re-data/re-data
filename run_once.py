
from redata.dags.schedule_checks import run_check_for_new_tables, run_checks

if __name__ == "__main__":

    print("run_checks")

    run_checks()

    print ("run_check_for_new_table")

    run_check_for_new_tables()