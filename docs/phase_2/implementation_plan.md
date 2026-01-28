# Implementation Plan - Day 2: PII Engine Integration

## Goal Description
Integrate Microsoft Presidio into the FastAPI backend to detect PII (Sensitive Personal Information). This will serve as the core logic for redacting sensitive data before it reaches the LLM.

## Proposed Changes

### Backend (`/backend`)

#### [NEW] [pii_service.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/pii_service.py)
- Initialize `AnalyzerEngine` and `AnonymizerEngine` from Presidio.
- Provide a `scan_text(text: str)` function that returns detected entities.
- Provide a `redact_text(text: str)` function that returns a redacted string and the token mapping.

#### [NEW] [test_pii.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/test_pii.py)
- A standalone script to verify that Presidio is correctly detecting PII like names, emails, and phone numbers.

## Verification Plan
### Automated Tests
- Run `docker compose exec backend python test_pii.py`.
- Verify output shows successful detection of sample PII.
- Verify redaction logic produces unique stable tokens for multiple instances of the same entity type.

### Manual Verification
- None required for this phase.
