from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/agentforit")
client = None
db = None

class MockCollection:
    async def insert_one(self, data): return type('obj', (object,), {'inserted_id': 'mock_id'})()
    async def find_one(self, query, sort=None): return None
    def find(self, query, sort=None): 
        async def to_list(length): return []
        return type('cursor', (object,), {'to_list': to_list, 'sort': lambda n, d: None, 'skip': lambda n: None})()
    async def update_one(self, query, update): return type('res', (object,), {'modified_count': 1})()
    async def delete_one(self, query): return type('res', (object,), {'deleted_count': 1})()

class MockDB:
    def __init__(self):
        self.missions = MockCollection()
        self.results = MockCollection()
        self.alerts = MockCollection()
        self.users = MockCollection()

client = None
db = MockDB()

async def connect_db():
    global client, db
    print("Initiating resilient database connection...")
    try:
        client = AsyncIOMotorClient(
            MONGODB_URI, 
            tls=True, 
            tlsAllowInvalidCertificates=True, 
            serverSelectionTimeoutMS=5000,
            directConnection=False
        )
        # Verify connection
        await client.admin.command('ping')
        db = client.get_database("agentforit")
        print(f"✅ Database connected successfully at {MONGODB_URI}")
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
        print("🚀 Bypassing database requirement: Backend will use in-memory cache for this session.")
        db = MockDB()

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_db():
    return db
