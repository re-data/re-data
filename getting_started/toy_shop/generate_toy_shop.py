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
end_date = datetime.datetime(2021,1, 11)

def write_to_csv(list, header, filename):
    with open(filename, "w") as f:
        writer = csv.writer(f, quotechar='"')
        writer.writerow(header)
        writer.writerows(list)

def get_proper_date():
    date = random_date(start_date, end_date)
    return date


def orders():
    states = ["paid", "pending", "delivered"]

    orders = []    
    for i in range(1, 5000):
        id = i
        customer_id = random.randint(1, 100)
        status = random.choice(states)
        amount = random.randint(50, 200)
        created_at = get_proper_date()
        orders.append([id, customer_id, status, amount, created_at])

    orders.append([id + 2, 100, "ok", "", datetime.datetime(2021, 1, 10, 10, 18, 0)])
    orders.append([id + 3, 100, "sold", "", datetime.datetime(2021, 1, 10, 10, 15, 0)])
    orders.append([id + 4, 100, "bad", "", datetime.datetime(2021, 1, 10, 10, 13, 0)])
    orders.append([id + 5, 100, "failed", "", datetime.datetime(2021, 1, 10, 10, 19, 0)])
    orders.append([id + 6, 100, "okay", "", datetime.datetime(2021, 1, 10, 10, 17, 0)])
    orders.append([id + 7, 100, "new", "", datetime.datetime(2021, 1, 10, 10, 17, 0)])
    write_to_csv(orders, ["id","customer_id","status","amount","created_at"], "seeds/orders.csv")

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
            
        random_age = random.randint(0, 65)
        if random_age >= 18:
            age = random_age
        else:
            if created_at < datetime.datetime(2021, 1, 5):
                age = None
            else:
                age = 0

        customers.append([id, name, surname, age, created_at])
    
    write_to_csv(customers, ["id","first_name","last_name","age","joined_at"], "seeds/customers.csv")


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

    order_items.append([item_id + 1, 100, "Plane", 100, datetime.datetime(2021, 1, 6, 4, 14, 0)])
    for i in range(1, 50):
        order_items.append([random.randint(7000, 8000), "", "", random.randint(1, 100), random_date(start_date, end_date)])

    write_to_csv(order_items, ["item_id","order_id","name","amount","added_at"], "seeds/order_items.csv")


def companies():
    companies = []
    for i in range(1, 50):
        id = i
        name = "Company " + str(i)
        address = "Address " + str(i)
        created_at = get_proper_date()
        companies.append([id, name, address, created_at])

    write_to_csv(companies, ["id","name","address","created_at"], "seeds/companies.csv")


if __name__ == "__main__":
    orders()
    customers()
    order_items()
    companies()