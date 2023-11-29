FROM python:3.10.13-slim-bullseye

WORKDIR /backend

COPY requirements.txt /tmp

RUN pip install -r /tmp/requirements.txt

COPY . /backend

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003"]
