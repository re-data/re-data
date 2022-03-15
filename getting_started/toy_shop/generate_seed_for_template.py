from random import randint, randrange
from datetime import datetime, timedelta
import csv

status = ['PENDING_PAYMENT', 'PAID', 'SHIPPED', 'DELIVERED']
names = ['Matias Douglas', 'Raelyn Harrison', 'Anaya Reed', 'Mario Harris', 'John Roberts', 'David Ramos',
    'Luis Morris', 'Luka Hall', 'Hector Davis', 'Ava Parker', 'George Douglas', 'Juan Rodriguez', 
    'Damian Fleming', 'Ana Myers', 'Joseph Richardson'
  ]

start = datetime(2021, 1, 1)
end = datetime(2021, 1, 11)

def random_date(start, end):
    """
    This function will return a random datetime between two datetime 
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)

def generate_random_orders():
    data = []
    for i in range(1, 201):
        data.append({
            'id': i,
            'customer_id': i % 15 + 1,
            'status': status[i % 4],
            'amount': randint(1, 10) * 5000,
            'time_created': str(random_date(start, end))
        })
    # introduce 20 anomalies on the 7th day
    for i in range(201, 221):
        data.append({
            'id': i,
            'customer_id': 10,
            'status': 'PENDING_PAYMENT',
            'amount': randint(1, 10) * 25000,
            'time_created': str(datetime(2021, 1, 7))
        })

    keys = data[0].keys()
    with open('../../re_data/dbt_template/seeds/orders.csv', 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)


def generate_random_customers():
    data = []
    for i in range(1, 16):
        data.append({
            'id': i,
            'age': randint(18, 60),
            'name': names[i-1],
        })
    keys = data[0].keys()
    with open('../../re_data/dbt_template/seeds/customers.csv', 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)

generate_random_orders()
generate_random_customers()
