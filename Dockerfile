FROM apache/airflow

COPY redata /usr/local/redata/redata
COPY scripts /usr/local/redata/scripts
COPY setup.py /usr/local/redata/

WORKDIR /usr/local/redata
RUN pip3 install . --user

