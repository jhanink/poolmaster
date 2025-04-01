import { WebSocketServer, WebSocket } from "ws";
import { Server } from 'http';
import fs from 'fs-extra';
import { appStateFilePath } from "../config/AppConfig";
import type { AppState } from "../config/AppState";

const BROADCAST_INTERVAL = 1000 * 10; // 10 seconds

class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer | null = null;
  private interval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public initialize(server: Server): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.wss = new WebSocketServer({ server });
    console.log('--- WebSocket server initialized');

    this.wss.on('connection', (ws: WebSocket) => {
      //console.log('--- Client connected');
      ws.on('message', (message: string) => {
        console.log(`--- ${message}`, `(${this.wss.clients.size} clients)`);
      });
    });
    this.wss.on('close', (code, reason) => {
      console.log('--- WebSocket server closed', code, reason);
    });
    this.wss.on('error', (error) => {
      console.error('--- WebSocket server error:', error.name);
    });

    // synchronize state with clients every 10 seconds
    this.interval = setInterval(this.broadcastState, BROADCAST_INTERVAL);
  }

  public broadcastState() {
    const fileData: string = fs.readFileSync(appStateFilePath, 'utf8');
    const appState: AppState = JSON.parse(fileData);
    webSocketManager.broadcast({...appState});
  }

  public getWebSocketServer(): WebSocketServer | null {
    return this.wss;
  }

  public broadcast(message: any) {
    if (!this.wss) {
      console.error("--- WebSocket server not initialized.");
      return;
    }

    const messageString = JSON.stringify(message);
    //console.log(`Broadcasting message to ${this.wss.clients.size} clients`);

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