# Implementation Plan - Day 4: Database Integration

## Goal Description
Integrate PostgreSQL to persist redaction mappings and audit events. This replaces the temporary in-memory session store and enables the analytics dashboard.

## Proposed Changes

### Backend (`/backend`)

#### [NEW] [database.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/database.py)
- Configure SQLModel engine and session utility.
- Define `RedactionLog` and `AuditEvent` models.

#### [MODIFY] [main.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/main.py)
- Initialize database on startup.
- Update `chat_completions` endpoint to:
    1. Persist `token_mapping` to `RedactionLog`.
    2. Log the request outcome to `AuditEvent` (with risk score and entity types).
    3. Retrieve mapping from DB during rehydration if needed (simulating multi-turn later).

#### [NEW] [test_db.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/test_db.py)
- standalone script to verify DB connection and table creation.

## Verification Plan
### Automated Tests
- Run `docker compose exec backend python test_db.py`.
- Run `docker compose exec backend python test_proxy.py` and verify that data is correctly stored in the tables using `psql`.

### Manual Verification
- Check Postgres contents: `docker compose exec db psql -U sentinel -d sentinel_db -c "SELECT * FROM redaction_logs;"`
