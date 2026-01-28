# AI Agents Context: Sentinel AI Privacy Proxy

> **Role**: You are an expert Full-Stack AI Engineer contributing to the Sentinel AI Privacy Proxy.
> **Goal**: Maintain the "Man-in-the-Middle" security architecture while ensuring high performance and data consistency.

## 🧠 Core Architecture & Tech Stack

The system follows a Proxy pattern orchestrated via Docker Compose:

1.  **Frontend (Dashboard)**:
    * **Framework**: Next.js 15 (App Router)
    * **Styling**: Tailwind CSS + Shadcn/UI
    * **Visualization**: Tremor (React components for charts)
    * **Role**: Read-only observability. *Note: Uses `node:20-slim` to avoid Alpine/Turbopack glibc issues.*

2.  **Backend (Proxy Engine)**:
    * **Framework**: FastAPI (Python 3.10+)
    * **ORM**: SQLModel (SQLAlchemy + Pydantic)
    * **PII Engine**: Microsoft Presidio
    * **Role**: Handles request interception, redaction, LLM forwarding, and rehydration.

3.  **Database**:
    * **Image**: `postgres:15-alpine`
    * **Port**: Mapped to `5433` (host) -> `5432` (container).

## 🗄️ Database Schema Context

Agents should use this schema reference for SQL generation:

* **`RedactionLog`**: Stores the raw mapping for PII rehydration.
    * `id` (int): Primary Key.
    * `request_id` (str): Linked to the chat completion ID.
    * `original_text` (str): **SENSITIVE** (Encrypted/Raw PII).
    * `masked_text` (str): The tokenized version (e.g., `<PERSON_1>`).
    * `entity_type` (str): e.g., "PERSON", "EMAIL_ADDRESS".

* **`AuditEvent`**: High-level logging for the dashboard.
    * `id` (int): Primary Key.
    * `timestamp` (datetime): UTC time of request.
    * `model` (str): Target LLM (e.g., "gpt-4", "gemini-1.5-flash").
    * `pii_detected` (bool): Flag for filtering.
    * `latency_ms` (float): Processing overhead.

## 💻 Coding Standards

### Python (Backend)
* **Async/Await**: All route handlers and DB calls must be `async`.
* **Type Hinting**: Strict usage of Python 3.10+ type hints.
* **Models**: Use `SQLModel` for both DB tables and Pydantic schemas.
* **Testing**: Use `pytest`. Tests are located in `backend/test_*.py`.

### TypeScript (Frontend)
* **Components**: Functional components only. Use `React.FC` is optional, prefer explicit props typing.
* **Fetching**: Use `fetch` inside `useEffect` or Server Actions. *Do not use Axios unless necessary.*
* **UI Library**: Reuse Shadcn components from `components/ui/` before building custom ones.

## 🛡️ Data Redaction Strategy

**"Stable Token Mapping"**:
We do not simply replace PII with `[REDACTED]`. We verify context coherence.
* *Input*: "Email shubham@test.com and cc shubham@test.com"
* *Redaction*: "Email <EMAIL_1> and cc <EMAIL_1>"
* *Rehydration*: The LLM's response containing `<EMAIL_1>` is swapped back to `shubham@test.com` before reaching the user.

## 📡 API Contract

* **POST** `/v1/chat/completions`: The main entry point. Compatible with OpenAI Python Client.
* **GET** `/api/v1/stats/*`: Internal analytics endpoints.

## ⚡ Quick Operational Commands

| Task | Command | Context |
| :--- | :--- | :--- |
| **Start System** | `docker-compose up --build` | Root |
| **Run PII Tests** | `python backend/test_pii.py` | Local (requires venv) |
| **Run Proxy Tests** | `docker-compose exec backend python test_proxy.py` | **Preferred** (runs inside container) |
| **DB Access** | `psql -h localhost -p 5433 -U sentinel -d sentinel_db` | Password: `password` |

## 🤖 Development Workflow (Phase-Based)

We use a strict **"Draft -> Plan -> Execute -> Document"** cycle found in `docs/`:
1.  **Draft**: Create `docs/phase_N/implementation_plan.md`.
2.  **Execute**: Implement changes, updating `docs/phase_N/task.md`.
3.  **Document**: Finalize with `docs/phase_N/walkthrough.md` (screenshots/logs).