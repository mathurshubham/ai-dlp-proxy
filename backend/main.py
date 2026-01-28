from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import os
import requests
import json
import uuid
import time
from database import init_db, engine, RedactionLog, AuditEvent, Session as DBSession
from sqlmodel import Session
from pii_service import pii_service

app = FastAPI(title="Sentinel AI Privacy Proxy")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# --- OpenAI Signature Models ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = 1.0
    stream: Optional[bool] = False

class ChatCompletionResponseChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str

class ChatCompletionResponse(BaseModel):
    id: str = Field(default_factory=lambda: f"chatcmpl-{uuid.uuid4()}")
    object: str = "chat.completion"
    created: int = 1677652288
    model: str
    choices: List[ChatCompletionResponseChoice]
    usage: Dict[str, int] = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

# --- Core Proxy Logic ---

@app.get("/")
async def root():
    return {"message": "Sentinel AI Proxy Active"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest, req: Request):
    """
    OpenAI-compatible endpoint that redacts PII before forwarding
    and rehydrates PII after receiving the response.
    Points to Postgres for persistence.
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    # 1. Redaction Phase
    redacted_messages = []
    total_mapping = {}
    entity_types = set()
    
    for msg in request.messages:
        if msg.role == "user":
            redacted_content, mapping = pii_service.redact_text(msg.content)
            redacted_messages.append(ChatMessage(role=msg.role, content=redacted_content))
            total_mapping.update(mapping)
            # Collect entity types for audit (e.g., PERSON from <PERSON_1>)
            for token in mapping.keys():
                etype = token.strip("<>").split("_")[0]
                entity_types.add(etype)
        else:
            redacted_messages.append(msg)
            
    # 2. Persist Redaction Log
    with Session(engine) as session:
        log = RedactionLog(
            request_id=request_id,
            token_map=total_mapping,
            provider="mock" if not os.getenv("OPENAI_API_KEY") else "openai"
        )
        session.add(log)
        session.commit()

    # 3. Forwarding Phase (Provider Detection)
    api_key_openai = os.getenv("OPENAI_API_KEY")
    api_key_google = os.getenv("GOOGLE_API_KEY")
    
    is_gemini = "gemini" in request.model.lower()
    llm_response_content = ""
    provider = "mock"

    if is_gemini and api_key_google:
        provider = "google"
        import google.generativeai as genai
        genai.configure(api_key=api_key_google)
        # Handle gemini-2.5-pro/flash, gemini-3-pro/flash
        model = genai.GenerativeModel(request.model)
        
        # Convert ChatMessage to Gemini format
        contents = []
        for msg in redacted_messages:
            role = "user" if msg.role == "user" else "model"
            contents.append({"role": role, "parts": [msg.content]})
        
        gemini_response = model.generate_content(contents)
        llm_response_content = gemini_response.text
    elif not is_gemini and api_key_openai:
        provider = "openai"
        # Placeholder for real OpenAI call
        llm_response_content = f"I understand. (Real API call to OpenAI would happen here with redacted content)"
    else:
        # Mock Response
        mock_token = list(total_mapping.keys())[0] if total_mapping else "the user"
        llm_response_content = f"I understand. I have noted the details for {mock_token}."

    # 4. Rehydration Phase
    final_content = llm_response_content
    for token, original_value in total_mapping.items():
        final_content = final_content.replace(token, original_value)
        
    # 5. Audit Logging
    latency_ms = int((time.time() - start_time) * 1000)
    with Session(engine) as session:
        audit = AuditEvent(
            risk_score=len(total_mapping) * 0.1, 
            entity_types=list(entity_types),
            latency_ms=latency_ms,
            status="SUCCESS"
        )
        session.add(audit)
        session.commit()

    # 6. Construct Response
    return ChatCompletionResponse(
        id=f"chatcmpl-{request_id}",
        model=request.model,
        choices=[
            ChatCompletionResponseChoice(
                index=0,
                message=ChatMessage(role="assistant", content=final_content),
                finish_reason="stop"
            )
        ]
    )

# --- Analytics Endpoints ---

@app.get("/api/v1/stats/overview")
async def get_stats_overview():
    """Returns aggregate metrics for the dashboard."""
    with Session(engine) as session:
        from sqlmodel import func, select
        
        total_requests = session.exec(select(func.count(AuditEvent.id))).one()
        avg_latency = session.exec(select(func.avg(AuditEvent.latency_ms))).one() or 0
        
        # Count total PII entities redacted (sum of list lengths - approximate)
        audits = session.exec(select(AuditEvent)).all()
        pii_count = sum(len(a.entity_types) for a in audits)
        
        return {
            "total_requests": total_requests,
            "avg_latency_ms": round(float(avg_latency), 2),
            "pii_redacted_count": pii_count,
            "risk_score": round(min(1.0, (pii_count * 0.05)), 2)
        }

@app.get("/api/v1/stats/recent")
async def get_recent_stats():
    """Returns recent audit logs for the traffic inspector."""
    with Session(engine) as session:
        from sqlmodel import select, desc
        audits = session.exec(select(AuditEvent).order_by(desc(AuditEvent.timestamp)).limit(20)).all()
        return audits
