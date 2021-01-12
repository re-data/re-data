# STL imports

# Third parties imports
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Custom imports


@pytest.fixture(scope='function')
def setup_db(postgresql_my):

    def dbcreator():
        '''
        We want to use SQLAlchemy for it's object models to create tables. To do so we need the cursor object to pass to the engine. This function returns a connection.

        Returns
        -------
        [type]
            [description]
        '''
        return postgresql_my.cursor().connection

    engine = create_engine('postgresql+psycopg2://', creator=dbcreator)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
