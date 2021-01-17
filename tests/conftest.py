# STL imports
from pathlib import Path
from dotenv import load_dotenv
import tempfile
import os

# Third parties imports
from pytest_postgresql import factories

# Custom imports
# from .db_fixtures import *

ENV_PATH = Path(os.path.abspath(__file__)).resolve().parents[1]

# Load environment variables
load_dotenv(os.path.join(ENV_PATH, '.env_tests'))

# Create a postgres instance
# socket_dir = tempfile.TemporaryDirectory()

# postgresql_my_proc = factories.postgresql_proc(
#     port=None, unixsocketdir=socket_dir)

# postgresql_my = factories.postgresql('postgresql_my_proc')
