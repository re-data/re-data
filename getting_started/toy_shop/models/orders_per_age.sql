select o.id, o.amount, o.status, c.age, o.created_at from 
    {{ ref('orders') }} o, {{ ref('customers') }} c
where
    o.customer_id = c.id
order by
    o.created_at desc
