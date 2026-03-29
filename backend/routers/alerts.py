from fastapi import APIRouter, Depends, HTTPException, Query
from db.mongodb import get_db
from db.auth import get_user_id
from models.alert import Alert
from typing import List

router = APIRouter()

@router.get("", response_model=List[Alert])
async def list_alerts(
    user_id: str = Depends(get_user_id),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    db = get_db()
    if db is not None:
        alerts = await db.alerts.find({"user_id": user_id}).sort("sent_at", -1).skip((page - 1) * limit).to_list(limit)
        return alerts
    return []

@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        result = await db.alerts.update_one(
            {"alert_id": alert_id, "user_id": user_id},
            {"$set": {"acknowledged": True}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"status": "acknowledged"}
    return {"status": "failed"}

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        result = await db.alerts.delete_one({"alert_id": alert_id, "user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"status": "deleted"}
    return {"status": "failed"}
