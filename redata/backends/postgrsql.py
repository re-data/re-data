from redata.backends.base import DB

class Postgres(DB):
    def __init__(self, name, db):
        super().__init__(name, db)
    
    @staticmethod
    def numeric_types():
        return [
            'smallint',
            'integer',
            'bigint',
            'decimal',
            'numeric',
            'real',
            'double precision',
            'enum'
        ]

    @staticmethod
    def character_types():
        return [
            'character varying',
            'varchar',
            'character',
            'char',
            'text'
        ]

    @staticmethod
    def datetime_types():
        return [
            'timestamp without time zone',
            'timestamp with time zone',
            'date',
        ]

    def get_interval_sep(self):
        return "'"
    
    def get_age_function(self):
        return "age"
