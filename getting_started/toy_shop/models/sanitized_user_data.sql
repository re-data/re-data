{% set states_mapping = {'AZ': 'Arizona', 'IN': 'Indiana', 'WV': 'West Virginia', 'MN': 'Minnesota', 'NY': 'New York'}%}


select
    id,
    {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as full_name,
    email,
    {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as redacted_email,
    state,
    state__normalized,
    {{ re_data.valid_email('email') }} is_valid_email,
    created_at
from {{ 
    re_data.normalize_values(
        re_data.filter_remove_duplicates(ref('user_data'), ['id'], ['created_at DESC']),
         'state',
         states_mapping
        ) }} u
where {{ re_data.valid_uuid('id') }}