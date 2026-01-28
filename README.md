# Sentinel AI Privacy Proxy 🛡️

**Protect your sensitive data. Observe your AI interactions.**

Sentinel AI Privacy Proxy is a high-performance "Man-in-the-Middle" security layer designed to intercept, redact, and rehydrate PII (Sensitive Personal Information) in LLM conversations. It ensures that sensitive data like names, emails, and phone numbers never reach your AI provider while remaining invisible to the end-user.

## ✨ Key Features

- **Automated PII Redaction**: Uses Microsoft Presidio to detect and mask sensitive entities in real-time.
- **Bi-directional Rehydration**: Automatically restores redacted information in LLM responses before they reach the user.
- **OpenAI Compatible**: Drop-in replacement for OpenAI's `/v1/chat/completions` API.
- **Security Dashboard**: Visualizes blocked threats, risk scores, and system performance using Tremor.
- **Postgres Persistence**: Securely logs redaction events and audit data for CISO-level observability.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key (Optional, defaults to Mock Mode)

### Run with Docker
```bash
# Clone the repository
git clone <repo-url>
cd ai-privacy-proxy

# Start the stack
docker compose up -d --build
```

The services will be available at:
- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Proxy API**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🛠️ Usage Example

Point your OpenAI client to the proxy URL:

```python
import openai

client = openai.OpenAI(
    base_url="http://localhost:8000/v1", 
    api_key="your-key-here"
)

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "My name is Shubham Mathur and my phone is 9876543210."}]
)

print(response.choices[0].message.content)
# Output: "I understand. I have noted the details for Shubham Mathur." 
# (The LLM only saw <PERSON_1> and <PHONE_NUMBER_1>)
```

## 📊 Observability

The built-in dashboard provides real-time insights into your AI usage:
- **Total Requests & PII Counts**
- **Average Latency Overhead**
- **DLP Risk Scoring**
- **Live Traffic Inspector** (Sanitized view)

---
Built with ❤️ for AI Security.
