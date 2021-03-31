from datetime import timedelta


def transform_by_interval(time_interval, for_time):
    parts = time_interval.split(" ")
    if parts[-1] == "day":
        to_compare = for_time - timedelta(days=int(parts[0]))
    if parts[-1] == "hour":
        to_compare = for_time - timedelta(hours=int(parts[0]))
    return to_compare
