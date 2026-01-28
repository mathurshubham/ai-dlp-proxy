# Walkthrough - Day 2: PII Engine Integration

## Overview
I have integrated the PII (Sensitive Personal Information) detection and redaction engine using **Microsoft Presidio**. This service is the "Secret Sauce" of the proxy, ensuring that sensitive data like names, emails, and phone numbers are masked before reaching the LLM.

## Changes Made

### 1. PII Service Implementation
- Created [pii_service.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/pii_service.py).
- Implemented a priority-based redaction algorithm that handles overlapping entities (e.g., an Email address containing a URL).
- Configured unique token generation (e.g., `<PERSON_1>`, `<EMAIL_ADDRESS_1>`) to maintain conversation context.
- Filtered out the `UK_NHS` recognizer which tends to misidentify 10-digit phone numbers.

### 2. Verification Script
- Created [test_pii.py](file:///home/shubham/Documents/projects/ai-dev-tools-zoomcamp/ai-privacy-proxy/backend/test_pii.py) to validate the service inside the Docker environment.

## Verification Results

### Successfull PII Redaction
Ran the test script inside the backend container:
```bash
$ docker compose exec backend python test_pii.py
Original Text: Hello, my name is Shubham Mathur. My email is shubham@example.com and my phone number is 9876543210.

Redacted Text:
Hello, my name is <PERSON_1>. My email is <EMAIL_ADDRESS_1> and my phone number is <PHONE_NUMBER_1>.

Token Mapping:
{
  "<PHONE_NUMBER_1>": "9876543210",
  "<EMAIL_ADDRESS_1>": "shubham@example.com",
  "<PERSON_1>": "Shubham Mathur"
}

Test passed! Detection and Redaction are working correctly.
```

The system is now ready for **Day 3: Proxy Logic Implementation**, where we will wire this service into the actual `/v1/chat/completions` traffic flow.
