FROM python:3.10.13-slim-bullseye

WORKDIR .

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY app .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003"]
