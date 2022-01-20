select o.id, o.amount, o.status, c.age, o.created_at from 
    {{ ref('orders') }} o, {{ source('toy_shop_sources', 'toy_shop_customers') }} c
where
    o.customer_id = c.id
order by
    o.created_at desc
