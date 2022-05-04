
import os
import sys


def _supports_long_paths() -> bool:
    if sys.platform != 'win32':
        return True
    try:
        dll = WinDLL('ntdll')
    except OSError:
        return False
    if not hasattr(dll, 'RtlAreLongPathsEnabled'):
        return False
    dll.RtlAreLongPathsEnabled.restype = c_bool
    return dll.RtlAreLongPathsEnabled()

def _win_prepare_path(path: str) -> str:
    """Given a windows path, prepare it for use by making sure it is absolute
    and normalized.

    https://github.com/dbt-labs/dbt-core/blob/7f953a6d48a4db254b17fd3929d267e4b6069228/core/dbt/clients/system.py#L216
    """
    path = os.path.normpath(path)

    if not path.startswith('\\\\') and path.startswith('\\'):
        curdrive = os.path.splitdrive(os.getcwd())[0]
        path = curdrive + path
        
    if not os.path.splitdrive(path)[0]:
        path = os.path.join(os.getcwd(), path)

    return path

def convert_path(path: str) -> str:
    """
        Convert a path which might be >260 characters long, to one that will be writable/readable on Windows.
        On other platforms, this is a no-op.

        https://github.com/dbt-labs/dbt-core/blob/7f953a6d48a4db254b17fd3929d267e4b6069228/core/dbt/clients/system.py#L261
    """
    if len(path) < 250:
        return path
    if _supports_long_paths():
        return path

    prefix = "\\\\?\\"
    if path.startswith(prefix):
        return path

    path = _win_prepare_path(path)
    if not path.startswith(prefix):
        path = prefix + path
    return path
    


def load_file_contents_as_string(path: str, strip: bool = True) -> str:
    path = convert_path(path)
    with open(path, 'rb') as handle:
        to_return = handle.read().decode('utf-8')

    if strip:
        to_return = to_return.strip()

    return to_return
