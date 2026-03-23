from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/omnix")
client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.get_database("omnix")
    print(f"Connected to MongoDB at {MONGODB_URI}")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_db():
    return db
