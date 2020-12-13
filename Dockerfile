FROM apache/airflow
COPY . /usr/local/

ENV PYTHONPATH "${PYTONPATH}:/usr/local/"
WORKDIR /usr/local

RUN pip3 install . --user