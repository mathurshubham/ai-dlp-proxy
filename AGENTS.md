# AI Agents Context: Sentinel AI Privacy Proxy

This document provides essential context for other AI agents to understand, interact with, and contribute to this repository.

## 🧠 Core Architecture

The system follows a Proxy pattern:
1. **Frontend (Next.js)**: A read-only observability dashboard.
2. **Backend (FastAPI)**: The central logic engine.
    - `pii_service.py`: Contains the Microsoft Presidio integration.
    - `database.py`: Handles SQLModel persistence for `RedactionLog` and `AuditEvent`.
    - `main.py`: Orchestrates the Request -> Redact -> Forward -> Rehydrate -> Response flow.
3. **Database (PostgreSQL)**: Stores session mappings and security logs.

## 📡 API Specifications

### Proxy Chat Completions
`POST /v1/chat/completions`
- **Behavior**: Mirrors OpenAI API.
- **Security**: Automatically redacts `user` message `content` before forwarding.
- **Traceability**: Returns a `chatcmpl-<uuid>` ID linked to `redaction_logs`.

### Analytics API
- `GET /api/v1/stats/overview`: Aggregate metrics.
- `GET /api/v1/stats/recent`: List of latest `AuditEvent` objects.

## 🛠️ Maintenance & Testing

- **Backend Tests**: Run `python test_pii.py`, `python test_db.py`, or `python test_proxy.py` inside the `backend` container.
- **Dependency Conflicts**: If adding UI libraries, use `npm install --legacy-peer-deps` due to React 19 defaults in Next.js 15.
- **Alpine Issues**: The frontend uses `node:20-slim` to avoid glibc compatibility issues with Turbopack.

## 🛡️ Data Redaction Strategy

Redaction uses a **Stable Token Mapping** strategy. Multiple occurrences of the same PII value (e.g., the same email) are mapped to the same token within a request to maintain LLM coherence. Tokens follow the format `<ENTITY_TYPE_N>`.
