{{
    config(
        re_data_monitored=true,
        re_data_time_filter='time_created',
        re_data_anomaly_detector={'name': 'z_score', 'threshold': 2.2},
    )
}}

select o.id, o.amount, o.status, o.time_created, o.customer_id, c.age from 
    {{ ref('orders') }} o
left join {{ ref('customers') }} c 
on o.customer_id = c.id
where
    o.status = 'PENDING_PAYMENT'
