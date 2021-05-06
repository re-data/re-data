select
    *
from
    {{ ref('z_score')}}
where
    abs(z_score) > {{ var('redata:alerting_z_score') }}
