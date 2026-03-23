from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
import uuid

class AgentTask(BaseModel):
    url: str
    goal: str
    stealth: bool = False

class Mission(BaseModel):
    mission_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str = "New Mission"
    goal_nl: str
    agent_tasks: List[AgentTask]
    schedule: str = "0 9 * * *" # Default: 9 AM daily
    status: str = "active" # active | paused | archived | running
    category: str = "custom" # prices | news | jobs | stock | custom
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    total_runs: int = 0
