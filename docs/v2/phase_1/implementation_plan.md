# Implementation Plan: Sentinel AI Dashboard v2

## Goal Description
Transform the dashboard from a passive monitoring tool into an active control center with interactive workspace, advanced filtering, policy configuration, and rich data visualizations.

## User Review Required
> [!IMPORTANT]
> - Adding new endpoints to the backend: `/api/v1/stats/trend` and `/api/v1/stats/distribution`.
> - Modifying `GET /api/v1/stats/recent` to support filtering.
> - Installing new frontend dependencies: `@tremor/react`, `recharts`, `@headlessui/react`.

## Proposed Changes

### [Backend]
Summary of changes to support the new dashboard features.

#### [MODIFY] [main.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/main.py)
- Update `get_recent_stats` to accept `status`, `id`, and `entity_type` filters.
- Add `get_stats_trend` endpoint to return time-bucketed data for the area chart.
- Add `get_pii_distribution` endpoint to return breakdown of redacted items by type.

### [Frontend]
Summary of UI/UX enhancements and new components.

#### [NEW] [TrafficTrendChart.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/TrafficTrendChart.tsx)
- Dual-axis Area Chart for Request Count and Average Latency using `@tremor/react`.

#### [NEW] [PIIDistributionChart.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/PIIDistributionChart.tsx)
- Donut Chart showing the breakdown of PII redacted items by type.

#### [NEW] [FilterToolbar.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/FilterToolbar.tsx)
- Toolbar with search bar (User ID), Status dropdown, Entity Type dropdown, and Date Picker.

#### [NEW] [LogDetailSheet.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/LogDetailSheet.tsx)
- Slide-over panel using `@headlessui/react` to show log details, metadata, and "Reveal" action.

#### [NEW] [PolicySettingsModal.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/PolicySettingsModal.tsx)
- Modal to adjust Block Threshold and toggle specific detectors.

#### [MODIFY] [TrafficInspector.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/components/TrafficInspector.tsx)
- Add row click handlers to open `LogDetailSheet`.
- Integrate with `FilterToolbar`.

#### [MODIFY] [page.tsx](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/frontend/src/app/page.tsx)
- Update layout to include new charts and components.

## Verification Plan

### Automated Tests
- Run backend tests to ensure new endpoints return expected data.
- Verify filtering logic in `get_recent_stats`.

### Manual Verification
- Check UI responsive layout with new charts.
- Interact with filters and verify table updates.
- Open slide-over panel and test the "Reveal" button.
- Adjust policy settings and verify they are saved/applied (mocked if necessary).
