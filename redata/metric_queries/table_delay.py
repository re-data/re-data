DELAY_QUERY = \
"""
SELECT
  created_at AS "time",
  value
FROM metrics_data_delay
WHERE
  table_name = '{table_name}' and
  $__timeFilter(created_at)
ORDER BY 1
"""