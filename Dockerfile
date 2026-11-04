FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 STEMPROOF_DATA_DIR=/var/data STEMPROOF_ENV=production
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p /var/data
EXPOSE 8000
CMD ["sh","-c","uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
