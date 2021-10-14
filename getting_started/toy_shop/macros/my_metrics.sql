
{% macro re_data_metric_large_orders(context) %}
    coalesce(
      sum(
          case when amount > 300
            then 1
          else 0
          end
      ), 0
    )
{% endmacro %}