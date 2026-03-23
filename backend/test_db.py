import asyncio
import os
from dotenv import load_dotenv
from db.mongodb import connect_db, close_db, get_db

load_dotenv()

async def main():
    print("Testing MongoDB Connection...")
    try:
        await connect_db()
        db = get_db()
        if db is not None:
            # Try a ping or command
            res = await db.command("ping")
            print(f"Ping response: {res}")
            print("MongoDB Connection Successful!")
        else:
            print("Failed to get DB object")
    except Exception as e:
        print(f"MongoDB Connection Failed: {e}")
    finally:
        await close_db()

if __name__ == "__main__":
    asyncio.run(main())
