import { WebSocketServer, WebSocket } from "ws";
import { Server } from 'http';

class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer | null = null;
  private ID = Math.random().toString(36).substr(2, 9);

  private constructor() {
    console.log('---- WebSocketManager CONSTRUCTOR', this.ID);
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public initialize(server: Server): void {
    if (!this.wss) {
      this.wss = new WebSocketServer({ server });
      console.log('---- WebSocket server initialized', this.ID);

      this.wss.on('connection', (ws: WebSocket) => {
        console.log('---- client connected', this.ID);
        ws.on('message', (message: string) => {
          console.log('---- received from client: %s', this.ID);
        });
      });
      this.wss.on('close', (code, reason) => {
        console.log('---- WebSocket server closed', this.ID, code, reason);
      });
      this.wss.on('error', (error) => {
        console.error('---- WebSocket server error:', this.ID, error.name);
      }
      );
    }
  }

  public getWebSocketServer(): WebSocketServer | null {
    return this.wss;
  }

  public broadcast(message: any) {
    if (!this.wss) {
      console.error("WebSocket server not initialized.");
      return;
    }

    const messageString = JSON.stringify(message);
    console.log(`Broadcasting message to ${this.wss.clients.size} clients:`);

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });

  }
}

// Use globalThis to enforce a singleton
if (!globalThis.webSocketManager) {
  globalThis.webSocketManager = WebSocketManager.getInstance();
}

export const webSocketManager: WebSocketManager = globalThis.webSocketManager;