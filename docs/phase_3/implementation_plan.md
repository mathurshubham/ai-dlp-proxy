# Implementation Plan - Day 3: Proxy Logic Implementation

## Goal Description
Implement the core "Man-in-the-Middle" proxy logic. The proxy will intercept OpenAI Chat Completion requests, redact PII from input messages, forward the request to OpenAI, and rehydrate (deanonymize) the PII in the generated response.

## Proposed Changes

### Backend (`/backend`)

#### [MODIFY] [main.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/main.py)
- Define Pydantic models for OpenAI compatibility (`ChatCompletionRequest`, `ChatCompletionResponse`).
- Implement the `POST /v1/chat/completions` endpoint.
- Logic flow:
    1. Extract messages from request.
    2. Use `pii_service.redact_text` on the last user message.
    3. Store the `token_mapping` in an in-memory dictionary (temp store).
    4. Forward the redacted message list to OpenAI API.
    5. Receive response from OpenAI.
    6. Use the `token_mapping` to replace tokens back with original values in the LLM response.
    7. Return the rehydrated response to the client.

#### [NEW] [test_proxy.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/test_proxy.py)
- A script to test the proxy endpoint using `httpx` or `requests`.
- Initially, we will use a "Mock Mode" for OpenAI to avoid needing a real API key for testing the logic flow.

## Verification Plan
### Automated Tests
- Run `docker compose exec backend python test_proxy.py`.
- Verify that a prompt containing PII results in a successful response where the PII is correctly "rehydrated".
- Verify that the logs (if any) only show redacted data.

### Manual Verification
- None required for this phase.
