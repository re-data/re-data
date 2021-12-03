import datetime
import random
import csv
from typing import Mapping

def random_date(begin: datetime.datetime, end: datetime.datetime):
    epoch = datetime.datetime(1970, 1, 1)
    begin_seconds = int((begin - epoch).total_seconds())
    end_seconds = int((end - epoch).total_seconds())
    dt_seconds = random.randint(begin_seconds, end_seconds)

    return datetime.datetime.fromtimestamp(dt_seconds)

start_date = datetime.datetime(2021, 1, 1)
end_date = datetime.datetime(2021,1, 31)

def write_to_csv(list, header, filename):
    with open(filename, "w") as f:
        writer = csv.writer(f, quotechar='"')
        writer.writerow(header)
        writer.writerows(list)

def get_proper_date():
    date = random_date(start_date, end_date)

    if (date > datetime.datetime(2021, 1, 15)
        and date < datetime.datetime(2021, 1, 16)):

        date = random_date(start_date, end_date)

    return date


def orders():
    states = ["not paid", "paid", "pending", "shipped", "delivered"]

    orders = []    
    for i in range(1, 5000):
        id = i
        customer_id = random.randint(1, 100)
        status = random.choice(states)
        amount = random.randint(0, 200)
        created_at = get_proper_date()

        orders.append([id, customer_id, status, amount, created_at])

    orders.append([id + 1, 100, "not paid", "", datetime.datetime(2021, 1, 15, 5, 14, 0)])
    orders.append([id + 2, 100, "ok", "", datetime.datetime(2021, 1, 20, 10, 19, 0)])
    write_to_csv(orders, ["id","customer_id","status","amount","created_at"], "data/orders.csv")

def customers():
    names = ["Olivia", "Oliver", "Amelia", "George", "Isla", "Harry", "Ava", "Noah", "Emily", "Jack", "Sophia", "Charlie", "Grace", "Leo", "Mia", "Jacob", "Poppy", "Freddie", "Ella", "Alfie"]
    surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen"]

    customers = []
    for i in range(1, 500):
        id = i
        name = random.choice(names)
        surname = random.choice(surnames)
        created_at = get_proper_date()
        age = random.randint(18, 65)
        customers.append([id, name, surname, age, created_at])
    
    customers.append([id + 1, "", "", "", datetime.datetime(2021, 1, 10, 5, 14, 0)])
    customers.append([id + 2, "", "", random.randint(18, 65), datetime.datetime(2021, 1, 15, 10, 19, 0)])
    for i in range(1, 10):
        customers.append([random.randint(510, 1000), random.choice(names), random.choice(surnames), "", random_date(start_date, end_date)])

    write_to_csv(customers, ["id","first_name","last_name","age","joined_at"], "data/customers.csv")


def order_items():
    def get_toy_name():
        names = ["Teddy bear", "Lego", "Car", "Plane", "Train", "Bicycle", "Boat", "Helicopter", "Car", "Plane", "Train", "Bicycle", "Boat", "Helicopter"]
        return random.choice(names)

    order_items = []
    for i in range(1, 7000):
        item_id = i
        order_id = random.randint(1, 5000)
        toy_name = get_toy_name()
        price = random.randint(10, 1000)
        added_at = get_proper_date()
        order_items.append([item_id, order_id, toy_name, price, added_at])

    order_items.append([item_id + 1, 100, "Plane", 100, datetime.datetime(2021, 1, 10, 4, 14, 0)])
    for i in range(1, 50):
        order_items.append([random.randint(7000, 8000), "", "", random.randint(1, 100), random_date(start_date, end_date)])

    write_to_csv(order_items, ["item_id","order_id","name","amount","added_at"], "data/order_items.csv")


def companies():
    companies = []
    for i in range(1, 50):
        id = i
        name = "Company " + str(i)
        address = "Address " + str(i)
        created_at = get_proper_date()
        companies.append([id, name, address, created_at])

    write_to_csv(companies, ["id","name","address","created_at"], "data/companies.csv")


if __name__ == "__main__":
    orders()
    customers()
    order_items()
    companies()