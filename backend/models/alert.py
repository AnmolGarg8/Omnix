from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any
import uuid

class Alert(BaseModel):
    alert_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mission_id: str
    mission_name: str
    priority: str # LOW | MEDIUM | HIGH | CRITICAL
    brief: str
    anomalies: List[dict]
    channels: List[str] # ["email", "slack", "ntfy"]
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    acknowledged: bool = False
