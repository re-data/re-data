{{
    config(
        re_data_metrics={'table': ['orders_above_100']},
        re_data_columns=['amount', 'status', 'age'],
        re_data_anomaly_detector={'name': 'z_score', 'threshold': 2.0},
        re_data_owners=['frontend'],
    )
}}

select o.id, o.amount, o.status, c.age, o.created_at from 
    {{ ref('orders') }} o, {{ source(target.schema + '_sources', 'toy_shop_customers') }} c
where
    o.customer_id = c.id
order by
    o.created_at desc
