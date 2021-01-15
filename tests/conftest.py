# STL imports
import os
import tempfile
from dotenv import load_dotenv

# Third parties imports
from pytest_postgresql import factories

env_path = '.'

load_dotenv(os.path.join(env_path, '.env_tests'))


# Create a postgres instance
socket_dir = tempfile.TemporaryDirectory()

postgresql_my_proc = factories.postgresql_proc(
    port=None, unixsocketdir=socket_dir)

postgresql_my = factories.postgresql('postgresql_my_proc')
