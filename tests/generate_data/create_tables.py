from string import Template

from redata.db_operations import get_db_by_name

CREATE_TABLE = Template(
    """
    CREATE TABLE IF NOT EXISTS testing_table_$num (
        id integer,
        created_at timestamp default now(),

        column_1 text,
        column_2 integer,
        column_3 float
    );
"""
)

INSERT_ROWS = Template(
    """
    INSERT INTO testing_table_$num values (1, now(), 'ala', 1, 1.0);
    INSERT INTO testing_table_$num values (2, now(), 'bob', 2, 2.0);
    INSERT INTO testing_table_$num values (3, now(), 'alice', 3, 3.0);
    INSERT INTO testing_table_$num values (4, now(), 'bert', 4, 4.0);
"""
)


def create_tables(db_name, num_tables):
    db = get_db_by_name(db_name)
    assert db

    print("running sample table creation for: ", db_name)

    for el in range(num_tables):
        db.db.execute(CREATE_TABLE.substitute(num=el))
        db.db.execute(INSERT_ROWS.substitute(num=el))


if __name__ == "__main__":
    create_tables("SAMPLE_POSTGRES", 500)
