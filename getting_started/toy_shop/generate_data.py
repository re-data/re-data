import string
import csv
from datetime import datetime, timedelta
from random import randint
import random

def write_to_csv(item_list, file_name):
    with open(f'data/{file_name}.csv', mode='w') as csv_file:
        writer = csv.DictWriter(
            csv_file, fieldnames=item_list[0].keys(), quotechar='"', quoting=csv.QUOTE_NONNUMERIC
        )

        writer.writeheader()
        writer.writerows(item_list)
    

time_start = datetime(2021, 1, 1)
time_end = datetime(2021, 2, 1)
time_diff = time_end - time_start


def generate_customers():

    customer_names = [
        'Olivia','Oliver','Amelia','George','Isla','Harry','Ava','Noah','Emily','Jack','Sophia','Charlie','Grace','Leo','Mia','Jacob','Poppy','Freddie','Ella ','Alfie'
    ]
    customer_last_names = list([x + '.' for x in string.ascii_uppercase])
    item_list = []
    customer_id = 1
    for first_name in customer_names:
        for last_name in customer_last_names:
            random_num = randint(0, 30)
            random_age = randint(15, 45)
            if 25 > random_age > 20:
                random_age = 0

            if 30 > random_age > 32:
                random_age = 200

            random_day = time_start + timedelta(days=random_num)
            item_list.append(
                {'id': customer_id, 'first_name': first_name, 'last_name': last_name, 'age': random_age, 'joined_at': str(random_day)}
            )
            customer_id += 1

    item_list.append({'id': None, 'first_name': '', 'last_name': '', 'joined_at': str(time_end - timedelta(days=5))})
    return item_list

def generate_orders(customers):
    order_list = []
    order_id = 1
    for customer in customers:
        num = randint(0, 3)
        for order_num in range(num):
            amount = randint(100, 400)
            random_num = randint(0, 30)
            random_day = time_start + timedelta(days=random_num)
            
            if random_num == 25:
                status = 'pending'
            else:
                status = random.choice(['pending', 'paid', 'not paid'])
            
            if random_num == 22:
                continue

            order_list.append({
                'id': order_id, 'customer_id': customer['id'], 'amount': amount, 'status': status, 'created_at': str(random_day)
            })
            order_id += 1
        
    return order_list

def generate_order_items(order_list):
    toys = ['bicycle', 'train', 'doll', 'ball', 'teddy bear', 'kite', 'rubber ducky', 'airplane', 'crayons', 'rocking horse', 'car']
    colours = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'pink', 'orange']

    order_items = []
    item_id = 1
    for order in order_list:
        num_items = randint(1, 4)
        
        for i in range(num_items):
            name = random.choice(colours) + ' ' + random.choice(toys)
            amount = random.randint(1, 3)
            if random.randint(0, 100) == 0:
                amount = -1

            if random.randint(0, 50) == 0:
                name = ''

            order_items.append({
                'item_id': item_id, 'order_id': order['id'], 'name': name, 'amount': amount, 'added_at': str(order['created_at'])
            })

            item_id += 1

    return order_items


if __name__ == "__main__":
    customers = generate_customers()
    orders = generate_orders(customers)
    order_items = generate_order_items(orders)

    write_to_csv(customers, 'customers')
    write_to_csv(orders, 'orders')
    write_to_csv(order_items, 'order_items')