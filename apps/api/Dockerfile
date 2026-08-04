FROM python:3.11-slim

WORKDIR /app

# Install uv for fast dependency management
RUN pip install uv

COPY pyproject.toml .
RUN uv pip install --system -r pyproject.toml

COPY src/ ./src/

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
