# STL imports
import tempfile

# Third parties imports
from pytest_postgresql import factories


# Create a postgres instance
socket_dir = tempfile.TemporaryDirectory()

postgresql_my_proc = factories.postgresql_proc(
    port=None, unixsocketdir=socket_dir)

postgresql_my = factories.postgresql('postgresql_my_proc')
