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
    companies()