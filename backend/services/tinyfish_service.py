from tinyfish import TinyFish, BrowserProfile, ProxyConfig, ProxyCountryCode
import os
import asyncio
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

TINYFISH_API_KEY = os.getenv("TINYFISH_API_KEY")

async def run_agent(url: str, goal: str, stealth: bool = False) -> dict:
    client = TinyFish(api_key=TINYFISH_API_KEY)
    profile = BrowserProfile.STEALTH if stealth else BrowserProfile.LITE
    result_data = {
        "url": url,
        "events": [],
        "final_result": None,
        "streaming_url": None,
        "status": "running",
        "started_at": datetime.utcnow().isoformat()
    }
    try:
        with client.agent.stream(
            url=url,
            goal=goal,
            browser_profile=profile,
            proxy_config=ProxyConfig(
                enabled=True,
                country_code=ProxyCountryCode.IN
            )
        ) as stream:
            for event in stream:
                if event.type == "STREAMING_URL":
                    result_data["streaming_url"] = event.data
                elif event.type == "COMPLETE":
                    result_data["final_result"] = event.data
                    result_data["status"] = "success"
                result_data["events"].append({
                    "type": event.type,
                    "data": event.data,
                    "timestamp": datetime.utcnow().isoformat()
                })
    except Exception as e:
        result_data["status"] = "failed"
        result_data["error"] = str(e)
    return result_data

async def run_parallel_agents(agent_tasks: list[dict]) -> list[dict]:
    tasks = [
        run_agent(t["url"], t["goal"], t.get("stealth", False))
        for t in agent_tasks
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [
        r if not isinstance(r, Exception)
        else {"status": "failed", "error": str(r), "final_result": None, "url": agent_tasks[i]["url"]}
        for i, r in enumerate(results)
    ]

async def run_agent_with_retry(url: str, goal: str, max_retries: int = 3) -> dict:
    for attempt in range(max_retries):
        try:
            result = await run_agent(url, goal, stealth=True)
            if result.get("status") == "success" and result["final_result"]:
                return result
        except Exception as e:
            if attempt == max_retries - 1:
                return {"error": str(e), "final_result": None, "status": "failed", "url": url}
            await asyncio.sleep(2 ** attempt)
    return {"error": "Max retries exceeded", "final_result": None, "status": "failed", "url": url}
