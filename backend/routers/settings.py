from fastapi import APIRouter, Depends, HTTPException, Body
from db.mongodb import get_db
from db.auth import get_user_id
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_settings(user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        user = await db.users.find_one({"user_id": user_id})
        if not user:
            # First time user, create default settings
            default_user = {
                "user_id": user_id,
                "email": "user@example.com",
                "slack_webhook": None,
                "ntfy_topic": None,
                "default_schedule": "0 9 * * *",
                "alert_min_priority": "LOW",
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(default_user)
            return default_user
        return user
    return {}

@router.put("/")
async def update_settings(user_id: str = Depends(get_user_id), payload: dict = Body(...)):
    db = get_db()
    if db is not None:
        result = await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "email": payload.get("email"),
                "slack_webhook": payload.get("slack_webhook"),
                "ntfy_topic": payload.get("ntfy_topic"),
                "alert_min_priority": payload.get("alert_min_priority", "LOW"),
                "default_schedule": payload.get("default_schedule", "0 9 * * *")
            }}
        )
        return {"status": "updated"}
    return {"status": "failed"}
