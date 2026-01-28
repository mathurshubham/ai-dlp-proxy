# Walkthrough - Day 4: Database Integration

## Overview
I have integrated **PostgreSQL** to provide a persistent state for the Sentinel AI Privacy Proxy. This transition from in-memory storage to a robust database allows for multi-turn conversation support and provides the data source for our upcoming analytics dashboard.

## Changes Made

### 1. Database Layer (SQLModel)
- Created [database.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/database.py) to handle Postgres connectivity.
- Defined schemas for:
    - `redaction_logs`: Stores `request_id` and the sensitive `token_map` JSON.
    - `audit_events`: Stores metadata like `risk_score`, `entity_types` detected, and `latency_ms`.

### 2. Instrumented Proxy
- Updated [main.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/main.py) to initialize the database on startup and save logs for every request.

## Verification Results

### Database Connection Test
```bash
$ docker compose exec backend python test_db.py
Initializing database...
Tables created successfully.
Successfully inserted a record into redaction_logs.
Database verification PASSED.
```

### Persistence Verification
After running a proxy request, I verified the records exist in the database:
```bash
$ docker compose exec db psql -U sentinel -d sentinel_db -c "SELECT count(*) FROM redaction_logs;"
 count 
-------
     1
```

The system is now fully instrumented and ready for **Day 5: Dashboard Frontend**, where we will visualize this audit data.
