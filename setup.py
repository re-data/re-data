from setuptools import find_packages, setup

setup(
    version='0.0.5',
    author='redata-team',
    description='Monitoring system for data teams',
    name='redata',
    install_requires=[
        'apache-airflow',
        'psycopg2-binary',
        'grafana-api',
        'cattrs==1.0.0',
        'marshmallow-sqlalchemy==0.23.1',
        'marshmallow<3.0.0,>=2.18.0',
        'pyexasol',
        'pymysql',
        'cryptography',
        'pybigquery',
        'alembic',
        'scipy'
    ],
    entry_points = {
        'console_scripts': ['redata=redata.command_line:main'],
    },
    packages=find_packages()
)
