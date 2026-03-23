from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any
import uuid

class Anomaly(BaseModel):
    type: str # price_change | content_change | new_item | removed_item | availability | other
    severity: str # LOW | MEDIUM | HIGH | CRITICAL
    description: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None

class Result(BaseModel):
    result_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    run_id: str
    mission_id: str
    raw_json: dict
    embedding_vector: List[float]
    brief: str
    anomalies: List[Anomaly]
    alert_priority: str # LOW | MEDIUM | HIGH | CRITICAL
    changes_detected: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)
