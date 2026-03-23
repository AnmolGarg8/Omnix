from fastapi import APIRouter, Depends, HTTPException, Query
from db.mongodb import get_db
from db.auth import get_user_id
from models.result import Result
from typing import List, Optional

router = APIRouter()

@router.get("/{mission_id}", response_model=List[Result])
async def get_results(
    mission_id: str, 
    page: int = Query(1, ge=1), 
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_user_id)
):
    from services.redis_service import get_cache, set_cache
    cache_key = f"res_list:{mission_id}:{page}"
    cached = get_cache(cache_key)
    if cached: return cached

    db = get_db()
    if db is not None:
        query = {"mission_id": mission_id} if mission_id != "all" else {}
        results = await db.results.find(query).sort("timestamp", -1).skip((page - 1) * limit).to_list(limit)
        # Results from motor are dicts with bson objects, need serializing for cache
        from json import dumps
        set_cache(cache_key, results, ttl=600)
        return results
    return []

@router.get("/{mission_id}/latest", response_model=Optional[Result])
async def get_latest_result(mission_id: str, user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        result = await db.results.find_one({"mission_id": mission_id}, sort=[("timestamp", -1)])
        return result
    return None

@router.get("/{mission_id}/trend")
async def get_trend(mission_id: str, range: str = "30d", user_id: str = Depends(get_user_id)):
    db = get_db()
    if db is not None:
        # Simplified time-series extraction
        results = await db.results.find({"mission_id": mission_id}, sort=[("timestamp", 1)]).to_list(100)
        trend_data = []
        for r in results:
            # Extract numeric value or use anomaly score
            val = r.get("raw_json", {}).get("price") or r.get("raw_json", {}).get("count") or 50.0
            trend_data.append({
                "timestamp": r["timestamp"],
                "value": val,
                "anomalyDetected": r.get("changes_detected", False)
            })
        return trend_data
    return []
