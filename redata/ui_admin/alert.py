import flask_login as login

from redata.ui_admin.utils import BaseRedataView, table_details_link_formatter


class AlertView(BaseRedataView):
    can_delete = True
    can_create = False
    can_edit = False
    can_view_details = True

    column_searchable_list = ("text", "alert_type")

    column_list = [
        "created_at",
        "text",
        "alert_type",
        "table",
    ]

    def table_details_formatter(self, context, model, name):
        return table_details_link_formatter(model.table)

    def is_accessible(self):
        return login.current_user.is_authenticated

    column_formatters = {
        "created_at": BaseRedataView._user_formatter_time,
        "table": table_details_formatter,
    }
