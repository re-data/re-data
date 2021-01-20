# Third party imports
import pytest
import pdb

MAKE_Q = "CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);"
INSERT_Q = "INSERT INTO test VALUES(1, 2, 'c');"
SELECT_Q = "SELECT * FROM test;"


def test_check_data_delayed(postgresql):
    #pdb.set_trace()
    from redata.checks.data_delayed import check_data_delayed  # pylint:disable=import-outside-toplevel

    # Create a table in the database
    cur = postgresql.cursor()
    cur.execute(MAKE_Q)

    # Add a row to the table
    cur.execute(INSERT_Q)

    # Get the tables
    cur.execute(SELECT_Q)
    table = cur.fetchall()

    from redata.db_operations import get_db_object

    db = get_db_object(postgresql)

    check_data_delayed(db, table)

    cur.close()


# def test_example_postgres(postgresql):
#     """Check main postgresql fixture."""
#     # pdb.set_trace()
#     # from redata.checks.data_delayed import (
#     #     check_data_delayed
#     # )
#     cur = postgresql.cursor()
#     cur.execute(
#         "CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
#     postgresql.commit()
#     cur.close()
