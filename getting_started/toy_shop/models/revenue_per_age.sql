select created_at::date, age, sum(amount) from {{ ref('orders_per_age') }} where
    status = 'paid'
group by
    created_at::date,
    age