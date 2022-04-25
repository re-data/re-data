---
sidebar_position: 1
---

# Configuring Owners

Mapping of re_data model owners and their identifier is defined in the `re_data:owners_config` block in the dbt_project.yml file.
Here we can define an individual user or a group of users (team) with their respective identifiers. 
Each owner definition consists of 
- type: what kind of channel the identifier is used for. email | slack
- identifier: unique identifier used for the specified channel, e.g. slack member_id | email
- name: name associated with the identifier

An example configuration is shown below


```yaml title="dbt_project.yml"
vars:
  re_data:owners_config:
    user1:
      - type: slack
        identifier: U02FHBSXXXX
        name: user1
    backend:
      - type: email
        identifier: user1@getre.io
        name: user1

      - type: email
        identifier: user2@getre.io
        name: user2

      - type: slack
        identifier: U01F80NXXYY
        name: user2

      - type: slack
        identifier: U02FHBSXXXX
        name: user1
    frontend:
      - type: slack
        identifier: U02FHBSXXXX
        name: user1

      - type: email
        identifier: user2@getre.io
        name: user2
```

```yaml title="models/orders.sql"
{{
    config(
        re_data_anomaly_detector={'name': 'z_score', 'threshold': 2.0},
        re_data_owners=['backend'],
    )
}}
```

In the configuration above, re_data_owners consists of the backend team, user1 and user2 would be notified on any alerts relating to this model.