# Alert

Alert represents a problem, or at least a possible problem.
Redata creates alerts if metrics which are computed fall outside of expected range.
Will tell more about that here


## Computing alerts

So how can we know something is not right, one possible way if compare past to current state and look for anomalies.
Redata takes last 21 days of any metric computed on table and computed `z score` for the last record value.
If `z score` outside of range `(3, -3)` it alerts. You can for sure google z score so will skip defintion of it :)

## Reacting to alerts

When getting alert, expected bahaviour is to check Grafana and your data if something bad is indeed going on with your data.
If it is, of course you need to act. 
It may happen that it isn't and it's false alert, feel free to delete generated alert then.


## Adjusting threshold

If too many false alerts show up, it's possible adjusting settings for thresholds is needed.
Feel free to change `REDATA_ACCEPTABLE_Z_SCORE_DIFF=3.0` in `.env` file to different value in this case.

Also we will be really happy to help you with this situation, maybe by extending alerting mechanism and making it more sophisticated.
Let us know if that's happening :)

