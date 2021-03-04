import random
from datetime import datetime, timedelta
from redata.db_operations import metrics_db
from string import Template

EVENTS = Template(
    """
    CREATE TABLE IF NOT EXISTS sample.events_$partner (
        event_type text,
        uid text,
        value float,
        created_at timestamp default now()
    )
    """
)

SESSION = """
    CREATE TABLE IF NOT EXISTS sample.session (
        length integer,
        uid text,
        start_time timestamp default now(),
        end_time timestamp default now(),
        value float,
        created_at timestamp default now()
    )
"""

REPORT = """
    CREATE TABLE IF NOT EXISTS sample.report (
        name text,
        position integer,
        score float,
        created_at timestamp default now()
    )
"""

insert_to_events = Template(
    """
    INSERT INTO sample.events_$partner values (
        '$event_type', '$uid', $value, '$created_at'
    )
"""
)


def create_sample_tables_in_redata():

    partners = [
        "team1",
        "team2",
        "team3",
        "team4",
        "team5",
        "team6",
        "team7",
        "c1",
        "c2",
        "c3",
        "c4",
        "c5",
        "c6",
        "c7",
    ]

    types = [
        "OPEN",
        "CLICK",
        "EXIT",
    ]

    metrics_db.execute("CREATE SCHEMA IF NOT EXISTS sample")
    for partner in partners:
        metrics_db.execute(EVENTS.substitute(partner=partner))
    metrics_db.execute(SESSION)
    metrics_db.execute(REPORT)

    num_events = random.randint(5000, 10000)
    utc_now = datetime.utcnow()

    secs_in_month = 3000000

    failure_range = [1200000, 1400000]

    higher_values_range = [200000, 600000]

    nulls_show_up = [800000, 1000000]

    for event in range(num_events):
        print("Creating event ", event)
        how_much_back = random.randint(0, secs_in_month)
        rand_value = random.random() * 100
        random_uid = "uid_{}".format(random.randint(0, 1000))

        if failure_range[0] < how_much_back < failure_range[1]:
            how_much_back = random.randint(0, secs_in_month)

        if higher_values_range[0] < how_much_back < higher_values_range[1]:
            rand_value = random.random() * 100 * 5 + 50

        if nulls_show_up[0] < how_much_back < nulls_show_up[1]:
            random_uid = None

        created_at = utc_now - timedelta(seconds=how_much_back)

        metrics_db.execute(
            insert_to_events.substitute(
                partner=random.choice(partners),
                event_type=random.choice(types),
                uid=random_uid,
                value=rand_value,
                created_at=created_at,
            )
        )
