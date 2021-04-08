from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import (
    create_engine
)

Base = declarative_base()


def curry_create_engine():
    def _create_engine(url):
        def engine(**kwargs):
            return create_engine(url, **kwargs)
        return engine
    return _create_engine
