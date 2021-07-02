FROM python:3.8

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# COPY ./app/ ./app/
# COPY ./start* ./
# COPY ./test* ./

# EXPOSE 8080
# CMD ["uwsgi","--ini", "conf.ini"]
