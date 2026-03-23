from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.mongodb import connect_db, close_db
from services.scheduler_service import start_scheduler, shutdown_scheduler
from routers import missions, agents, results, alerts, settings
import agentops
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    # await start_scheduler() # Commented out until implemented to avoid import error
    # agentops.init(api_key=os.getenv("AGENTOPS_API_KEY"))
    yield
    # await shutdown_scheduler()
    await close_db()

app = FastAPI(title="Omnix API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder routers to avoid ImportErrors before files exist
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(agents.router,   prefix="/api/agents",   tags=["agents"])
app.include_router(results.router,  prefix="/api/results",  tags=["results"])
app.include_router(alerts.router,   prefix="/api/alerts",   tags=["alerts"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "omnix-backend"}
