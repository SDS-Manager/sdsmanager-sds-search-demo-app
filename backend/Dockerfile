FROM ghcr.io/sds-manager/sds:api-demo-be.base.v1.0

ENV PYTHONBUFFERED=1

WORKDIR /backend

COPY requirements.txt /tmp

RUN pip install -r /tmp/requirements.txt

COPY . /backend

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003", "--workers", "20"]
