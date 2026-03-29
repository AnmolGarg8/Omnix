from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.mongodb import connect_db, close_db
from services.scheduler_service import start_scheduler, shutdown_scheduler
from services.socket_manager import manager  # Prevents circular imports
from routers import missions, agents, results, alerts, settings
from datetime import datetime
import agentops
import os
import json
import asyncio
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing Armor-Plated Backend Lifespan...")
    try:
        await connect_db()
    except Exception as e:
        print(f"⚠️ connect_db failed: {e}")

    try:
        await start_scheduler()
    except Exception as e:
        print(f"⚠️ start_scheduler failed: {e}")

    try:
        if os.getenv("AGENTOPS_API_KEY"):
            agentops.init(api_key=os.getenv("AGENTOPS_API_KEY"))
    except Exception as e:
        print(f"⚠️ agentops.init failed: {e}")

    print("✅ Backend Lifespan Ready (Resilient Mode).")
    yield
    
    try:
        await shutdown_scheduler()
    except: pass
    try:
        await close_db()
    except: pass

app = FastAPI(title="AgentForIt API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight(rest_of_path: str):
    return {}

# Authentication and routers
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(agents.router,   prefix="/api/agents",   tags=["agents"])
app.include_router(results.router,  prefix="/api/results",  tags=["results"])
app.include_router(alerts.router,   prefix="/api/alerts",   tags=["alerts"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "agentforit-backend"}

# WebSockets handled via the manager in services/socket_manager.py
# (We use the 'manager' instance imported at the top)

@app.websocket("/ws/missions/{mission_id}")
async def mission_websocket(websocket: WebSocket, mission_id: str):
    await manager.connect(websocket, mission_id)
    print(f"WS Client Connected: {mission_id}")
    
    try:
        while True:
            # Poll for heartbeat or client messages if any
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=15.0)
            except asyncio.TimeoutError:
                # Send heartbeat if no message received
                await websocket.send_text(json.dumps({"type": "HEARTBEAT", "timestamp": datetime.utcnow().isoformat()}))
            except Exception:
                break
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, mission_id)
        print(f"WS Client Disconnected: {mission_id}")
    except Exception as e:
        manager.disconnect(websocket, mission_id)
        print(f"WS Error: {e}")

