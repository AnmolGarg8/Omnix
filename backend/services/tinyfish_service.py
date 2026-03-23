from tinyfish import TinyFish, BrowserProfile, ProxyConfig, ProxyCountryCode
import os
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
        "status": "running"
    }
    try:
        # Note: client.agent.stream is context manager in spec, might need to be used properly
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
                print(f"Event: {event.type}")
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
        print(f"Error: {e}")
    return result_data
