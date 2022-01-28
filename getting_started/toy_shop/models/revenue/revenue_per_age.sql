select cast (created_at as date) as created_at, age, sum(amount) as amount
from {{ ref('orders_per_age') }}
where
    status = 'paid'
group by
    created_at, age