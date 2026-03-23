import asyncio
import os
from backend.services.tinyfish_service import run_agent

async def main():
    print("Starting TinyFish Test...")
    res = await run_agent(
        url="https://google.com",
        goal="Extract the main text on the page",
        stealth=False
    )
    print(f"Status: {res['status']}")
    print(f"Final Result: {res['final_result']}")

if __name__ == "__main__":
    asyncio.run(main())
