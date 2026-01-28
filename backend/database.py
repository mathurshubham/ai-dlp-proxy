from sqlmodel import SQLModel, Field, create_engine, Session, JSON, Column, Text
from sqlalchemy.dialects.postgresql import ARRAY
from typing import Optional, List, Dict
import os
from datetime import datetime
import uuid

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://sentinel:password@db/sentinel_db")

engine = create_engine(DATABASE_URL)

class RedactionLog(SQLModel, table=True):
    __tablename__ = "redaction_logs"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    request_id: str = Field(index=True)
    user_id: Optional[str] = None
    provider: str = "openai"
    
    # Store {"<PER_1>": "Shubham"}
    token_map: Dict[str, str] = Field(default={}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

class AuditEvent(SQLModel, table=True):
    __tablename__ = "audit_events"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: Optional[str] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    risk_score: float = 0.0
    
    # List of redacted types: ["PERSON", "EMAIL_ADDRESS"]
    entity_types: List[str] = Field(default=[], sa_column=Column(ARRAY(Text)))
    
    latency_ms: int = 0
    status: str = "SUCCESS" # SUCCESS, BLOCKED, ERROR

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
