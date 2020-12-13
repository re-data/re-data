from setuptools import setup, find_packages

setup(
    version='0.0.1',
    author='Mateusz Klimek',
    description='Monitoring system for data teams',
    name='redata',
    install_requires=[
        'apache-airflow',
        'psycopg2-binary',
        'grafana-api',
        'cattrs==1.0.0',
        'marshmallow-sqlalchemy==0.23.1',
        'marshmallow<3.0.0,>=2.18.0',
        'pymysql',
        'cryptography'
    ],
    entry_points = {
        'console_scripts': ['redata=command_line:main'],
    },
    packages=find_packages()
)
