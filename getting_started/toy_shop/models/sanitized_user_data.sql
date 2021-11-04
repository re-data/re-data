{% set states_mapping = {'AZ': 'Arizona', 'IN': 'Indiana', 'WV': 'West Virginia', 'MN': 'Minnesota', 'NY': 'New York'}%}

with deduplicated as (
    select * from {{ re_data.filter_remove_duplicates(ref('user_data'), ['email'], ['created_at DESC']) }} as dedup
), 
cleaned as (
    select
        *,
        {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as formatted_full_name,
        {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as redacted_email,
        {{ re_data.valid_email('email') }} is_valid_email
    from deduplicated 
)

select
    *
from {{ re_data.normalize_values('cleaned', 'state', states_mapping) }} u