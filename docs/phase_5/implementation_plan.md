# Implementation Plan - Day 5: Dashboard Frontend

## Goal Description
Build a security dashboard to visualize blocked PII threats and system performance. This provides the "CISO-level" observability promised in the project summary.

## Proposed Changes

### Backend (`/backend`)

#### [MODIFY] [main.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/main.py)
- Implement `GET /api/v1/stats/overview`: Returns aggregate counts (Total Requests, PII Redacted, Average Latency).
- Implement `GET /api/v1/stats/recent`: Returns the last 10-20 audit logs for the "Live Traffic Inspector".

### Frontend (`/frontend`)

#### [NEW] [components/StatsOverview.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/StatsOverview.tsx)
- Visual cards for key metrics using Tremor/Tailwind.

#### [NEW] [components/TrafficInspector.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/TrafficInspector.tsx)
- A table view of recent requests showing redacted status and risk scores.

#### [MODIFY] [app/page.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/app/page.tsx)
- Assemble the dashboard components into a clean, modern layout.
- Fetch data from the backend API.

## Verification Plan
### Automated Tests
- Visit `http://localhost:3000` and verify the dashboard loads.
- Run a `test_proxy.py` request and see the metric update on the dashboard (after refresh).

### Manual Verification
- Verify the "Redacted View" in the traffic inspector hide PII but shows metadata.
