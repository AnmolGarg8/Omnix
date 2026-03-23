import upstash_redis
import os
import json
from typing import Optional, Any

UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL")
UPSTASH_REDIS_TOKEN = os.getenv("UPSTASH_REDIS_TOKEN")

redis = None
if UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN:
    redis = upstash_redis.Redis(url=UPSTASH_REDIS_URL, token=UPSTASH_REDIS_TOKEN)

def get_cache(key: str) -> Optional[Any]:
    """Retrieve data from Redis cache."""
    if not redis: return None
    try:
        data = redis.get(key)
        return json.loads(data) if data else None
    except Exception as e:
        print(f"Redis Get Error: {e}")
        return None

def set_cache(key: str, value: Any, ttl: int = 3600):
    """Save data to Redis cache with TTL."""
    if not redis: return
    try:
        redis.set(key, json.dumps(value), ex=ttl)
    except Exception as e:
        print(f"Redis Set Error: {e}")

def invalidate_cache(pattern: str):
    """Invalidate cache keys matching pattern."""
    if not redis: return
    # Simple pattern matching for Upstash
    try:
        keys = redis.keys(pattern)
        if keys:
            redis.delete(*keys)
    except Exception as e:
        print(f"Redis Invalidate Error: {e}")
