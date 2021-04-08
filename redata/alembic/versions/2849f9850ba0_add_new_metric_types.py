"""Add new metric types

Revision ID: 2849f9850ba0
Revises: 21a21ae32481
Create Date: 2021-04-08 08:46:07.228765

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "2849f9850ba0"
down_revision = "21a21ae32481"
branch_labels = None
depends_on = None

import json
from copy import deepcopy

from sqlalchemy.sql import text

from redata.metric import Metric

metrics_to_add = {
    Metric.COUNT_NULLS: [Metric.COUNT_NOT_NULLS, Metric.COUNT_NULLS_PR],
    Metric.COUNT_EMPTY: [Metric.COUNT_NOT_EMPTY, Metric.COUNT_EMPTY_PR],
}


def upgrade():
    conn = op.get_bind()
    checks = conn.execute("select id, metrics from checks")
    for chk_id, metrics in checks:
        new_metrics = deepcopy(metrics)

        for col, col_metrics in metrics.items():
            if col != Metric.TABLE_METRIC:
                for m in col_metrics:
                    if m in metrics_to_add:
                        new_metrics[col].extend(metrics_to_add[m])

        for col in new_metrics:
            new_metrics[col] = sorted(list(set(new_metrics[col])))

        if str(new_metrics) != str(metrics):
            update_txt = text("update checks set metrics = :metrics where id = :chk_id")
            conn.execute(update_txt, metrics=json.dumps(new_metrics), chk_id=chk_id)


def downgrade():
    """Do nothing, added metrics will stay in DB, they will be also ignored"""
    pass
