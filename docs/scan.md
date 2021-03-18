# Scan

Scan represents computing all metrics and alerts on active tables in your data.
Couple interesting parameters related to Scan:

## start_date & end_date

Each metrics Redata computes are related to some time window.
Curenlty this time window is last 24 hours. (Possible to change it, but you would need update Redata code.. :)

Running scan with `start_date = end_date` which is how by default scans are run will compute metrics only for 
for `(end_date-24h, end_date)` time period.

But if you want you can also backfill your metrics, you can change `start_date` to be something 30 days ago and in 
that case Redata will backfill all 30 days of stats about your data.
It will compute 31 scans for given time periods: 
```
(start_date-24h, start_date), (start_date, start_date+24h) .... (end_date - 24h, end_date)
```

## manual vs scheduled run

Redata will create runs automatically every hour (or on different interval if you change `REDATA_AIRFLOW_SCHEDULE_INTERVAL` in `.env` file)
But as mentioned you can trigger manual runs, most common use case is backfilling to get sense of data quality of data right now (or past problems).
