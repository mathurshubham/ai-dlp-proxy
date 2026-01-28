from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import os
import requests
import json
import uuid
from pii_service import pii_service

app = FastAPI(title="Sentinel AI Privacy Proxy")

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

# In-memory session store (Day 3 only, will move to Postgres in Day 4)
# Key: request_id, Value: token_mapping
session_store = {}

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
    """
    request_id = str(uuid.uuid4())
    
    # 1. Redaction Phase
    redacted_messages = []
    total_mapping = {}
    
    for msg in request.messages:
        if msg.role == "user":
            redacted_content, mapping = pii_service.redact_text(msg.content)
            redacted_messages.append(ChatMessage(role=msg.role, content=redacted_content))
            total_mapping.update(mapping)
        else:
            redacted_messages.append(msg)
            
    # 2. Forwarding Phase (Mock Mode for now)
    # In Day 3, we simulate the LLM response to test the rehydration logic
    # The simulated response will use a token if it's smart enough, 
    # but here we'll just mock a response that returns the tokens to see if rehydration works.
    
    # Detect if we should use Mock or Real OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        # Mock Response
        # We'll simulate the LLM responding to one of the tokens
        mock_content = f"I understand. I have noted the details for {list(total_mapping.keys())[0] if total_mapping else 'the user'}."
        llm_response_content = mock_content
    else:
        # Real Forwarding (Optional for Day 3, but let's implement the skeleton)
        try:
            # Note: We'd use a real HTTP client here like httpx or requests
            # For simplicity in this step, we'll keep the mock logic as primary
            # and only use real API if explicitly tested.
            mock_content = f"I understand. I have noted the details for {list(total_mapping.keys())[0] if total_mapping else 'the user'}."
            llm_response_content = mock_content
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # 3. Rehydration Phase
    final_content = llm_response_content
    for token, original_value in total_mapping.items():
        final_content = final_content.replace(token, original_value)
        
    # 4. Construct Response
    return ChatCompletionResponse(
        model=request.model,
        choices=[
            ChatCompletionResponseChoice(
                index=0,
                message=ChatMessage(role="assistant", content=final_content),
                finish_reason="stop"
            )
        ]
    )
