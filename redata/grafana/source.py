from redata import settings

def get_postgres_datasource():
    return {
        'name': settings.REDATA_GRAFANA_SOURCE,
        'type': 'postgres',
        'typeLogoUrl': 'public/app/plugins/datasource/postgres/img/postgresql_logo.svg',
        'access': 'proxy',
        'url': f'{settings.REDATA_METRICS_DATABASE_HOST}:5432', # use default port for communication internally
        'password': settings.REDATA_METRICS_DATABASE_PASSWORD,
        'user': settings.REDATA_METRICS_DATABASE_USER,
        'database': settings.REDATA_METRICS_DATABASE_NAME,
        'basicAuth': False,
        'jsonData': {'postgresVersion': 903, 'sslmode': 'disable'},
        'readOnly': False
    }