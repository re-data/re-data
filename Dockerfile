FROM apache/airflow
COPY . /usr/local/redata

WORKDIR /usr/local/redata
RUN pip3 install . --user

