

class DB(object):
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def execute(self, *args, **kwargs):
        return self.db.execute(*args, **kwargs)

    def is_numeric(self, col_type):
        return col_type in self.numeric_types()

    def is_character(self, col_type):
        return col_type in self.character_types()
