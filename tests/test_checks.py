# STL imports

# Third party imports
import pytest
import pdb

# Custom imports
# from redata.checks.data_delayed import (
#     check_data_delayed
# )


def test_check_data_delayed():
    pass


def test_example_postgres(postgresql):
    """Check main postgresql fixture."""
    cur = postgresql.cursor()
    cur.execute(
        "CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
    postgresql.commit()
    cur.close()

    #pdb.set_trace()
