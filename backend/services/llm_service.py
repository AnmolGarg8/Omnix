from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def parse_mission_to_tasks(goal_nl: str) -> dict:
    """
    Parse user's natural language goal into structured agent tasks using Groq's Llama-3.3-70b.
    Returns: { "tasks": [...], "category": str, "suggested_name": str }
    """
    client = Groq(api_key=GROQ_API_KEY)
    
    system_prompt = """
    You are the mission architect for AgentForIt. Your job is to parse a user's natural language goal into specific web intelligence tasks.
    
    Rules for Task Generation:
    1. If the user names specific sites (e.g. 'Amazon'), use them as URLs.
    2. If the user names a category (e.g. 'E-commerce sites'), pick 3 popular and relevant sites for that category.
    3. Set 'stealth': true for high-security sites like: Amazon, Flipkart, LinkedIn, AliExpress, Target, Walmart, government sites, or Cloudflare-protected sites.
    4. Mission Categories: prices | news | jobs | stock | regulations | custom.
    5. Generate a short, punchy 'suggested_name' (max 50 chars).
    
    Response Format (Strict JSON ONLY):
    {
      "tasks": [
        { "url": "...", "goal": "...", "stealth": boolean }
      ],
      "category": "...",
      "suggested_name": "..."
    }
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": goal_nl}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        # Fallback if LLM fails
        print(f"LLM Parsing Error: {e}")
        return {
            "tasks": [{"url": "https://google.com", "goal": goal_nl, "stealth": False}],
            "category": "custom",
            "suggested_name": "New Mission"
        }

async def analyze_results(current_result: Any, previous_result: Optional[Any], mission_goal: str) -> dict:
    """
    Compare current vs previous run and detect anomalies via Groq.
    Returns: { "anomalies": [...], "brief": str, "alert_required": bool, "alert_priority": str, "changes_detected": bool }
    """
    client = Groq(api_key=GROQ_API_KEY)
    
    system_prompt = f"""
    You are the central intelligence of AgentForIt. Your task is to compare the current scraping result with the previous one based on the user's mission goal: '{mission_goal}'.
    
    Detect:
    - Price changes (drops/hikes)
    - Availability changes (in stock / out of stock)
    - New items added or old items removed
    - Structural or significant content changes
    
    Rules:
    - 'brief' should be a 2-3 sentence executive summary.
    - 'alert_required' is true if any anomaly has severity MEDIUM, HIGH, or CRITICAL.
    - 'severity' levels: LOW | MEDIUM | HIGH | CRITICAL.
    
    Response Format (Strict JSON ONLY):
    {{
      "anomalies": [
        {{
          "type": "price_change | content_change | new_item | removed_item | availability | other",
          "severity": "LOW | MEDIUM | HIGH | CRITICAL",
          "description": "human readable explanation",
          "old_value": "...",
          "new_value": "..."
        }}
      ],
      "brief": "...",
      "alert_required": boolean,
      "alert_priority": "LOW | MEDIUM | HIGH | CRITICAL",
      "changes_detected": boolean
    }}
    """
    
    user_prompt = f"""
    CURRENT RESULT: {json.dumps(current_result)}
    PREVIOUS RESULT: {json.dumps(previous_result) if previous_result else 'None (First run)'}
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"LLM Analysis Error: {e}")
        return {
            "anomalies": [],
            "brief": f"Could not analyze results due to error: {str(e)}",
            "alert_required": False,
            "alert_priority": "LOW",
            "changes_detected": False
        }
