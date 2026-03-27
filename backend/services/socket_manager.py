from fastapi import WebSocket
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, mission_id: str):
        await websocket.accept()
        if mission_id not in self.active_connections:
            self.active_connections[mission_id] = []
        self.active_connections[mission_id].append(websocket)

    def disconnect(self, websocket: WebSocket, mission_id: str):
        if mission_id in self.active_connections:
            self.active_connections[mission_id].remove(websocket)
            if not self.active_connections[mission_id]:
                del self.active_connections[mission_id]

    async def broadcast_mission_event(self, mission_id: str, data: dict):
        if mission_id in self.active_connections:
            for connection in self.active_connections[mission_id]:
                try:
                    await connection.send_text(json.dumps(data))
                except Exception as e:
                    print(f"WS Broadcast Error to {mission_id}: {e}")

manager = ConnectionManager()
