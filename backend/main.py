from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.mongodb import connect_db, close_db
from services.scheduler_service import start_scheduler, shutdown_scheduler
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
    await connect_db()
    await start_scheduler()
    if os.getenv("AGENTOPS_API_KEY"):
        agentops.init(api_key=os.getenv("AGENTOPS_API_KEY"))
    yield
    await shutdown_scheduler()
    await close_db()

app = FastAPI(title="Omnix API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication and routers
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(agents.router,   prefix="/api/agents",   tags=["agents"])
app.include_router(results.router,  prefix="/api/results",  tags=["results"])
app.include_router(alerts.router,   prefix="/api/alerts",   tags=["alerts"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "omnix-backend"}

@app.websocket("/ws/missions/{mission_id}")
async def mission_websocket(websocket: WebSocket, mission_id: str):
    await websocket.accept()
    print(f"WS Client Connected: {mission_id}")
    
    try:
        while True:
            # Heartbeat and events channel
            data = {"type": "HEARTBEAT", "timestamp": datetime.utcnow().isoformat()}
            await websocket.send_text(json.dumps(data))
            
            try:
                # Poll for incoming client messages if any.
                await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
            except asyncio.TimeoutError:
                pass
                
            await asyncio.sleep(15) 
            
    except WebSocketDisconnect:
        print(f"WS Client Disconnected: {mission_id}")
    except Exception as e:
        print(f"WS Error: {e}")
        await websocket.close()
