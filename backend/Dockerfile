# ================================================================
# CI/CD Healing Agent - Docker Image
# Provides an isolated, safe execution environment for:
#   - Cloning repositories
#   - Installing Python/Node dependencies
#   - Running tests
#   - Applying AI-generated fixes
# ================================================================

FROM python:3.12-slim

# Security: Run as non-root user
RUN groupadd -r agent && useradd -r -g agent -d /home/agent -s /bin/bash agent
RUN mkdir -p /home/agent && chown agent:agent /home/agent

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    build-essential \
    ca-certificates \
    nodejs \
    npm \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# Configure git
RUN git config --global --add safe.directory '*'
RUN git config --global user.email "ci-healer@ai-agent.dev"
RUN git config --global user.name "CI/CD Healing Agent"

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Security: Switch to non-root
USER agent

# Resource limits enforced via docker-compose
# Memory: 2GB, CPU: 1 core (configurable)

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
