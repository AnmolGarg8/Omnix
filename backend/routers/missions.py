from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from db.mongodb import get_db
from db.auth import get_user_id
from models.mission import Mission, AgentTask
from services.llm_service import parse_mission_to_tasks
from services.scheduler_service import schedule_mission
import uuid
from datetime import datetime

router = APIRouter()

async def process_mission_in_background(mission_id: str, goal_nl: str, user_id: str):
    print(f"🕵️ Background Processing for Mission {mission_id}...")
    try:
        # LLM Parsing
        parsed_goal = await parse_mission_to_tasks(goal_nl)
        
        # Prepare updates
        updates = {
            "name": parsed_goal.get("suggested_name", "Mission " + mission_id[:8]),
            "agent_tasks": [AgentTask(**t).dict() for t in parsed_goal.get("tasks", [])],
            "category": parsed_goal.get("category", "custom"),
            "status": "active"
        }
        
        # Save to DB
        db = get_db()
        await db.missions.update_one({"mission_id": mission_id}, {"$set": updates})
        print(f"✅ Mission {mission_id} processed successfully.")
    except Exception as e:
        print(f"❌ Background Error for {mission_id}: {e}")

@router.post("")
async def create_mission(request: Request, payload: dict, background_tasks: BackgroundTasks, user_id: str = Depends(get_user_id)):
    """
    POST /api/missions - INSTANT RESPONSE mode
    """
    try:
        goal_nl = payload.get("goal_nl", "New Mission")
        schedule_expr = payload.get("schedule", "0 9 * * *")
        
        # Create a "Shell" mission instantly
        mission_id = str(uuid.uuid4())
        mission_data = Mission(
            mission_id=mission_id,
            user_id=user_id,
            name="Launching...",
            goal_nl=goal_nl,
            agent_tasks=[],
            schedule=schedule_expr,
            status="pending"
        )
        
        # Save shell to DB (quick)
        db = get_db()
        try:
            await db.missions.insert_one(mission_data.dict())
        except: pass # MockDB fallback
        
        # Offload heavy AI thinking to background
        background_tasks.add_task(process_mission_in_background, mission_id, goal_nl, user_id)
        
        # Respond INSTANTLY to keep the UI happy
        return mission_data
        
    except Exception as e:
        print(f"🔥 Critical Mission Bypass: {e}")
        return Mission(user_id=user_id, goal_nl=goal_nl, agent_tasks=[], status="pending")

@router.get("", response_model=List[Mission])
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

@router.delete("/{mission_id}")
async def delete_mission(mission_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        result = await db.missions.delete_one({"mission_id": mission_id, "user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Mission not found")
        return {"status": "deleted"}
    raise HTTPException(status_code=500, detail="Database connection failed")
