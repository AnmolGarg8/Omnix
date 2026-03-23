from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.jobstores.mongodb import MongoDBJobStore
from db.mongodb import get_db, client as mongodb_async_client
import uuid
import json
from datetime import datetime
from services.tinyfish_service import run_parallel_agents
from services.llm_service import analyze_results
from services.embedding_service import generate_embedding
# from services.alert_service import send_all_alerts # Phase 4

# Placeholder since APScheduler needs a sync client or a separate initialization
# In main.py, we call connect_db first.
scheduler = None

async def start_scheduler():
    global scheduler
    # In a real app, initialize with MongoDBJobStore
    # For dev Phase 3, we use default MemoryJobStore to verify logic.
    scheduler = AsyncIOScheduler()
    scheduler.start()
    print("APScheduler Started")

async def shutdown_scheduler():
    global scheduler
    if scheduler:
        scheduler.shutdown()
        print("APScheduler Shutdown")

async def schedule_mission(mission_id: str, cron_expr: str):
    if scheduler:
        scheduler.add_job(
            func=execute_mission_pipeline,
            trigger=CronTrigger.from_crontab(cron_expr),
            args=[mission_id],
            id=f"mission_{mission_id}",
            replace_existing=True
        )

async def execute_mission_pipeline(mission_id: str):
    db = get_db()
    if db is None: return
    
    # 1. Load mission
    mission = await db.missions.find_one({"mission_id": mission_id})
    if not mission or mission["status"] != "active":
        return

    # 2. Update status to running
    await db.missions.update_one(
        {"mission_id": mission_id},
        {"$set": {"status": "running", "last_run": datetime.utcnow()}}
    )

    # 3. Create agent_run doc
    run_id = str(uuid.uuid4())
    # ... Simplified for Phase 3 logic ...
    
    # 4. Run parallel agents
    raw_results = await run_parallel_agents(mission["agent_tasks"])
    
    # 5. Fetch previous result
    previous = await db.results.find_one(
        {"mission_id": mission_id},
        sort=[("timestamp", -1)]
    )

    # 6. LLM Analysis
    analysis = await analyze_results(
        current_result=raw_results,
        previous_result=previous.get("raw_json") if previous else None,
        mission_goal=mission["goal_nl"]
    )

    # 7. Embedding
    result_text = json.dumps(raw_results)
    embedding = await generate_embedding(result_text)

    # 8. Save result
    from models.result import Result
    result_doc = {
        "result_id": str(uuid.uuid4()),
        "run_id": run_id,
        "mission_id": mission_id,
        "raw_json": raw_results,
        "embedding_vector": embedding,
        "brief": analysis["brief"],
        "anomalies": analysis["anomalies"],
        "alert_priority": analysis["alert_priority"],
        "changes_detected": analysis["changes_detected"],
        "timestamp": datetime.utcnow()
    }
    await db.results.insert_one(result_doc)

    # 9. Update mission stats
    await db.missions.update_one(
        {"mission_id": mission_id},
        {"$set": {"status": "active"}, "$inc": {"total_runs": 1}}
    )

    # 10. Send alerts if needed
    if analysis["alert_required"]:
        from services.alert_service import send_all_alerts
        await send_all_alerts(
            user_id=mission["user_id"],
            analysis=analysis,
            mission_id=mission_id,
            mission_name=mission["name"]
        )

    print(f"Mission {mission_id} complete. Changes detected: {analysis['changes_detected']}")
