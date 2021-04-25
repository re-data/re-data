
select * from {{ ref('table_query') }} where metric = 'min'