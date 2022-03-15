{{
    config(
        re_data_columns=['amount', 'status'],
        re_data_metrics={'table': ['orders_above_100']},
        re_data_anomaly_detector={'name': 'z_score', 'threshold': 3.0},
        materialized='table'
    )
}}

select id, customer_id, status, amount, created_at from {{ ref('orders') }} where status = 'pending'