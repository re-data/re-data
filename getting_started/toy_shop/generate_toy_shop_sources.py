

def generate_customers_sql_values(file_name):
    f = open(file_name, 'r')
    lines = f.readlines()

    out = []
    lines = lines[1:]
    for line in lines:
        line = line.strip()
        id, first_name, last_name, age, joined_at = line.split(',')
        out.append("""({id}, '{first_name}', '{last_name}', {age}, '{joined_at}')""".format(
            id=id, first_name=first_name, last_name=last_name, age=age or 'NULL', joined_at=joined_at
        ))

    output =  ',\n'.join(out)
    print (output)


if __name__ == '__main__':
    generate_customers_sql_values('customers.csv')


        
