import os

DEFAULT_CONFIG_DIR = os.path.join(os.path.expanduser("~"), ".re_data")
RE_DATA_CONFIG_DIR = os.path.expanduser(os.getenv("RE_DATA_CONFIG_DIR", DEFAULT_CONFIG_DIR))
SEND_ANONYMOUS_USAGE_STATS = not os.getenv("RE_DATA_SEND_ANONYMOUS_USAGE_STATS", "").strip() == "0"