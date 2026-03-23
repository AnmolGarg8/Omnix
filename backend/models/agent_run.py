from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any
import uuid

class AgentEvent(BaseModel):
    type: str
    data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentRun(BaseModel):
    run_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mission_id: str
    site_url: str
    status: str = "running" # running | success | failed
    streaming_url: Optional[str] = None
    raw_result: Optional[dict] = None
    events: List[AgentEvent] = []
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
