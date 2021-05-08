select
    *
from
    {{ ref('z_score')}}
where
    abs(z_score_value) > {{ var('redata:alerting_z_score') }}
