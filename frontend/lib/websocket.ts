export type AgentEvent = {
  type: string;
  site?: string;
  message?: string;
  data?: any;
  timestamp: string;
};

export class MissionWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onEvent: (event: AgentEvent) => void;
  private reconnectInterval: number = 3000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  constructor(missionId: string, onEvent: (event: AgentEvent) => void) {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    this.url = `${baseUrl}/ws/missions/${missionId}`;
    this.onEvent = onEvent;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onEvent(data);
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket Closed");
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      this.ws?.close();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnect on intentional close
      this.ws.close();
      this.ws = null;
    }
  }
}
