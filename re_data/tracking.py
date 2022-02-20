import analytics
import os
import uuid
from re_data import flags
import yaml
from yaml import SafeLoader
from functools import wraps
import platform

try:
    from importlib import metadata
except ImportError:
    import importlib_metadata as metadata # python<=3.7

analytics.write_key = 'ROINJZvn7ksDkALq7IKFtErKvaPGvqd2'

def initialize_tracker():
    if flags.SEND_ANONYMOUS_USAGE_STATS:
        return Tracker()
    else:
        return None

class Tracker():
    def __init__(self) -> None:
        if not self.has_cookie():
            self.set_cookie()

        self.user_id = self.get_cookie()["id"]
        self.env = self.get_environment()
        
    @property
    def cookie_path(self):
        return os.path.join(self.cookie_dir, ".user.yml")

    @property
    def cookie_dir(self):
        return flags.RE_DATA_CONFIG_DIR

    def get_cookie(self):
        with open(self.cookie_path, "r") as fh:
            user = yaml.load(fh, Loader=SafeLoader)
            return user

    def has_cookie(self):
        if not os.path.exists(self.cookie_path):
            return False
        return True
    
    def set_cookie(self):
        user = {"id": str(uuid.uuid4())}

        if not os.path.exists(self.cookie_dir):
            os.makedirs(self.cookie_dir)
        
        if not os.path.exists(self.cookie_path):
            with open(self.cookie_path, "w") as fh:
                yaml.dump(user, fh)

        analytics.identify(user["id"], {})

    def get_environment(self):
        
        return {
            'dbt_version': metadata.version('dbt-core'),
            're_data_version': metadata.version('re-data'),
            'python_version': platform.python_version(),
            'os_system': platform.system(),
        }
    
    def track(self, event, properties):
        analytics.track(self.user_id, event, properties)

def anonymous_tracking(fun):
    global anonymous_tracker

    @wraps(fun)
    def decorated(*args, **kwargs):
        ctx = anonymous_tracker.get_environment()

        try:
            if anonymous_tracker:
                ctx.update({"status": "start"})
                anonymous_tracker.track("{}".format(fun.__name__), ctx)

            fun(*args, **kwargs)

            if anonymous_tracker:
                ctx.update({"status": "success"})
                anonymous_tracker.track("{}".format(fun.__name__), ctx)
        except Exception as e:
            if anonymous_tracker:
                
                ctx.update({"error": str(e)})
                ctx.update({"status": "exception"})

                anonymous_tracker.track("{}".format(fun.__name__), ctx)
            raise e

    return decorated


anonymous_tracker = initialize_tracker()


    
