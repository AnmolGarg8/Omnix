from fastapi import APIRouter, Depends, HTTPException, Request
from db.mongodb import get_db
from db.auth import get_user_id
from models.mission import Mission, AgentTask
from services.llm_service import parse_mission_to_tasks
from services.scheduler_service import schedule_mission
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=Mission)
async def create_mission(request: Request, payload: dict, user_id: str = Depends(get_user_id)):
    """
    POST /api/missions
    Accepts: { "goal_nl": str, "schedule": str, "name": str }
    Steps:
    1. Parse NL goal via LLM
    2. Save mission to MongoDB
    3. Schedule the cron job
    """
    goal_nl = payload.get("goal_nl")
    schedule_expr = payload.get("schedule", "0 9 * * *") # Default: daily 9 AM
    user_name = payload.get("name") # Optional custom name
    
    if not goal_nl:
        raise HTTPException(status_code=400, detail="goal_nl is required")
    
    # 1. Parse NL goal
    parsed_goal = await parse_mission_to_tasks(goal_nl)
    
    # 2. Create Mission document
    mission_data = Mission(
        user_id=user_id,
        name=user_name if user_name else parsed_goal.get("suggested_name", "New Mission"),
        goal_nl=goal_nl,
        agent_tasks=[AgentTask(**t) for t in parsed_goal.get("tasks", [])],
        schedule=schedule_expr,
        category=parsed_goal.get("category", "custom"),
    )
    
    # 3. Save to MongoDB
    db = get_db()
    if db is not None:
        await db.missions.insert_one(mission_data.dict())
        
        # Invalidate cache
        from services.redis_service import invalidate_cache
        invalidate_cache(f"missions:{user_id}")
        
        # 4. Schedule the job
        # await schedule_mission(mission_data.mission_id, schedule_expr) # Commented until implemented
        
        return mission_data
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")

@router.get("/", response_model=List[Mission])
async def list_missions(user_id: str = Depends(get_user_id)):
    from services.redis_service import get_cache, set_cache
    cache_key = f"missions:{user_id}"
    cached = get_cache(cache_key)
    if cached: return cached

    db = get_db()
    if db is not None:
        missions = await db.missions.find({"user_id": user_id}).to_list(100)
        set_cache(cache_key, missions, ttl=300)
        return missions
    return []

@router.post("/{mission_id}/run-now")
async def run_mission_now(mission_id: str, user_id: str = Depends(get_user_id)):
    """
    Trigger an immediate, manual run of the mission.
    """
    db = get_db()
    if db is not None:
        mission = await db.missions.find_one({"mission_id": mission_id, "user_id": user_id})
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        # Trigger the pipeline in the background
        from services.scheduler_service import execute_mission_pipeline
        import asyncio
        asyncio.create_task(execute_mission_pipeline(mission_id))
        
        return {"status": "running", "message": "Mission triggered successfully"}
    return {"status": "failed"}

@router.post("/{mission_id}/pause")
async def pause_mission(mission_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        from services.scheduler_service import pause_mission_schedule
        # await pause_mission_schedule(mission_id) # implementation in scheduler_service 
        await db.missions.update_one({"mission_id": mission_id, "user_id": user_id}, {"$set": {"status": "paused"}})
        return {"status": "paused"}
    return {"status": "failed"}

@router.post("/{mission_id}/resume")
async def resume_mission(mission_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        # await resume_mission_schedule(mission_id)
        await db.missions.update_one({"mission_id": mission_id, "user_id": user_id}, {"$set": {"status": "active"}})
        return {"status": "resumed"}
    return {"status": "failed"}
