# Alert

Alert represents a problem, or at least a possible problem.
Redata creates alerts if metrics which are computed fall outside of expected range.
Will tell more about it here.


## Computing alerts

How can Redata know something is not right? one possible way is to compare past to current state and look for anomalies.
Redata takes last 21 days of any metric computed on table and computes `z score` for the last record value.
If `z score` outside of range `(3, -3)` it alerts. You can for sure google z score so will skip defintion of it :)

## Reacting to alerts

When getting alert, expected bahaviour is to check Grafana and your data if something bad is indeed going on with your data (or data you are receiving from partnering team/companies)
If it is, of course you need to act, most likely stop processing, let people producing data know about it, etc. You know it best most likely ;)
It may happen that it isn't and it's false alert, feel free to delete generated alert then.

## Stop pipelines in case of alerts

Currently Redata is meant be used as alarming tool and we are not trying to plug in to your pipelines and stop a jobs autmatically in case of alert.
If this is feaure if would be intersted in let us know ;)

## Adjusting threshold

If too many false alerts show up, it's possible adjusting settings for thresholds is needed.
Feel free to change `REDATA_ACCEPTABLE_Z_SCORE_DIFF=3.0` in `.env` file to different value in this case.

Also we will be really happy to help you with this situation, maybe by extending alerting mechanism and making it more sophisticated.
Let us know if that's happening :)
