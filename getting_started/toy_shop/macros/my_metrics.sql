
{% macro re_data_metric_orders_above_100(context) %}
    coalesce(
      sum(
          case when amount > 100
            then 1
          else 0
          end
      ), 0
    )
{% endmacro %}