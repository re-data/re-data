import random
from datetime import datetime, timedelta
from redata.db_operations import metrics_db
from string import Template

EVENTS = Template("""
    CREATE TABLE IF NOT EXISTS sample.events_$partner (
        event_type text,
        uid text,
        value float,
        created_at timestamp default now()
    )
    """)

SESSION= """
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
        'team1',
        'team2',
        'team3',
        'c1',
        'c2',
        'c3'
    ]

    types = [
        'OPEN',
        'CLICK',
        'EXIT',
    ]

    metrics_db.execute("CREATE SCHEMA IF NOT EXISTS sample")
    for partner in partners:
        metrics_db.execute(EVENTS.substitute(partner=partner))
    metrics_db.execute(SESSION)
    metrics_db.execute(REPORT)

    num_events = random.randint(5000, 10000)
    utc_now = datetime.utcnow()

    secs_in_month = 2592000

    for event in range(num_events):
        print ("Creating event ", event)
        created_at = utc_now - timedelta(seconds=random.randint(0, secs_in_month))

        metrics_db.execute(
            insert_to_events.substitute(
                partner=random.choice(partners),
                event_type=random.choice(types),
                uid='uid_{}'.format(random.randint(0, 1000)),
                value=random.random() * 100,
                created_at=created_at
            )
        )