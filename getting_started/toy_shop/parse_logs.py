
import json
import csv

HEADERS = ['code', 'data_conn_name', 'data_sql', 'data', 'invocation_id', 'level', 'log_version', 'msg', 'node_info', 'pid', 'thread_name', 'ts', 'type']
# HEADERS = ['code', 'data', 'invocation_id', 'level', 'log_version', 'msg', 'node_info', 'pid', 'thread_name', 'ts', 'type']

def process_dbt_log(filename):
    with open('logs/re_data_dbt_logs.csv', mode='w') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=HEADERS)
        writer.writeheader()
        with open(filename) as file:
            for line in file:
                try:
                    log_obj = json.loads(line.strip())
                    if 'invocation_id' not in log_obj:
                        continue
                    data = log_obj.get('data') or {}
                    msg = log_obj.get('msg')
                    log_obj['msg'] = msg.replace('\n', ' ')
                    log_obj['data_conn_name'] = data.get('conn_name')
                    log_obj['data_sql'] = data.get('sql').replace('\n', ' ')
                    log_obj['data'] = json.dumps(data)
                    writer.writerow(log_obj)
                except Exception as e:
                    print('json parse error ' + str(e))
                    
                
    
filename = 'logs/dbt.log'
process_dbt_log(filename)

