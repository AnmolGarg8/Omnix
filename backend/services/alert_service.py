import httpx
import resend
import os
import json
import asyncio
import uuid
from datetime import datetime
from db.mongodb import get_db

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

async def send_email_alert(to: str, brief: str, anomalies: list, priority: str, mission_name: str, mission_id: str):
    """
    Send email alert via Resend.
    """
    priority_emoji = "🚨" if priority == "CRITICAL" else "🔴" if priority == "HIGH" else "🟠" if priority == "MEDIUM" else "🟡"
    
    anomaly_list = "".join([f"<li><b>{a['type']}</b>: {a['description']}</li>" for a in anomalies])
    
    html_content = f"""
    <div style="font-family: sans-serif; background-color: #0A0A0F; color: #F1F5F9; padding: 40px; border-radius: 8px;">
        <h1 style="color: #6366F1; font-size: 24px;">{priority_emoji} AgentForIt Alert — {mission_name}</h1>
        <p style="font-size: 16px; line-height: 1.6;">{brief}</p>
        <div style="background-color: #111118; border: 1px solid #1E1E2E; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h2 style="font-size: 14px; text-transform: uppercase; color: #94A3B8;">Detected Anomalies</h2>
            <ul style="margin: 10px 0; padding-left: 20px;">{anomaly_list}</ul>
        </div>
        <a href="{FRONTEND_URL}/dashboard/missions/{mission_id}" 
           style="background-color: #6366F1; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
           View Mission Results
        </a>
    </div>
    """
    
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": "AgentForIt <alerts@agentforit.ai>",
            "to": [to],
            "subject": f"{priority_emoji} AgentForIt Alert — {mission_name}",
            "html": html_content
        })
    except Exception as e:
        print(f"Email Alert Error: {e}")

async def send_slack_alert(webhook_url: str, brief: str, anomalies: list, priority: str, mission_name: str, mission_id: str):
    """
    Send Slack alert via Block Kit.
    """
    emoji_map = {"CRITICAL": "🚨", "HIGH": "🔴", "MEDIUM": "🟠", "LOW": "🟡"}
    emoji = emoji_map.get(priority.upper(), "🔍")
    
    blocks = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": f"{emoji} AgentForIt Alert: {mission_name}", "emoji": True}
        },
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"*Brief Index*\n{brief}"}
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "fields": [
                {"type": "mrkdwn", "text": f"*Priority*\n{priority}"},
                {"type": "mrkdwn", "text": f"*Detected At*\n{datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"}
            ]
        },
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": "*Anomalies:*"}
        }
    ]
    
    for a in anomalies[:3]: # Limit to 3 in slack summary
        blocks.append({
            "type": "section",
            "text": {"type": "mrkdwn", "text": f"• *{a['type']}*: {a['description']}"}
        })
        
    blocks.append({
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "View Full Run"},
                "url": f"{FRONTEND_URL}/dashboard/missions/{mission_id}",
                "style": "primary"
            }
        ]
    })
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(webhook_url, json={"blocks": blocks})
    except Exception as e:
        print(f"Slack Alert Error: {e}")

async def send_ntfy_alert(topic: str, brief: str, priority: str):
    """
    Send alert via ntfy.sh.
    """
    priority_map = {"CRITICAL": "urgent", "HIGH": "high", "MEDIUM": "default", "LOW": "low"}
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"https://ntfy.sh/{topic}",
                content=brief,
                headers={
                    "Title": "AgentForIt Alert",
                    "Priority": priority_map.get(priority.upper(), "default"),
                    "Tags": "mag,robot"
                }
            )
    except Exception as e:
        print(f"Ntfy Alert Error: {e}")

async def send_all_alerts(user_id: str, analysis: dict, mission_id: str, mission_name: str):
    """
    Coordinate sending alerts across all configured channels for a user.
    """
    db = get_db()
    if db is None: return
    
    user = await db.users.find_one({"user_id": user_id})
    if not user: return
    
    # Priority threshold check
    priority_levels = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
    user_threshold = priority_levels.get(user.get("alert_min_priority", "LOW"), 0)
    current_priority = priority_levels.get(analysis["alert_priority"], 0)
    
    if current_priority < user_threshold:
        return # Skip alerts below threshold
    
    channels_sent = []
    
    # Email
    if user.get("email"):
        await send_email_alert(user["email"], analysis["brief"], analysis["anomalies"], analysis["alert_priority"], mission_name, mission_id)
        channels_sent.append("email")
        
    # Slack
    if user.get("slack_webhook"):
        await send_slack_alert(user["slack_webhook"], analysis["brief"], analysis["anomalies"], analysis["alert_priority"], mission_name, mission_id)
        channels_sent.append("slack")
        
    # Ntfy
    if user.get("ntfy_topic"):
        await send_ntfy_alert(user["ntfy_topic"], analysis["brief"], analysis["alert_priority"])
        channels_sent.append("ntfy")

    # Save to Alert History
    if channels_sent:
        from models.alert import Alert
        alert_doc = {
            "alert_id": str(uuid.uuid4()),
            "user_id": user_id,
            "mission_id": mission_id,
            "mission_name": mission_name,
            "priority": analysis["alert_priority"],
            "brief": analysis["brief"],
            "anomalies": analysis["anomalies"],
            "channels": channels_sent,
            "sent_at": datetime.utcnow(),
            "acknowledged": False
        }
        await db.alerts.insert_one(alert_doc)

