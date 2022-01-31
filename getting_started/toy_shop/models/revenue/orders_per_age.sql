{{
    config(re_data_metrics={'table': ['orders_above_100']})
}}

select o.id, o.amount, o.status, c.age, o.created_at from 
    {{ ref('orders') }} o, {{ source(target.schema + '_sources', 'toy_shop_customers') }} c
where
    o.customer_id = c.id
order by
    o.created_at desc
