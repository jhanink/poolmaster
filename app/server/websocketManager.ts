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

    this.wss.on('connection', (ws: WebSocket, request: Request) => {
      const fakePrefix = 'http://localhost';
      const url = new URL(`${fakePrefix}${request.url}`);
      const sourceId = url.searchParams.get('sourceId');
      const clientId = url.searchParams.get('clientId');

      (ws as any).sourceId = sourceId;
      console.log(`--- Client ${clientId} connected - source ${sourceId}`);

      ws.on('message', (message: string) => {
        console.log(`--- ${message}`, `(${this.wss.clients.size} clients), ${sourceId}`);
      });
    });
    this.wss.on('close', (code, reason) => {
      console.log('--- WebSocket server closed', code, reason);
    });
    this.wss.on('error', (error) => {
      console.error('--- WebSocket server error:', error.name);
    });

    // NOTE: In a SAAS environment, every account APP_STATE
    // needs to be pushed out to all connected clients
    // associated by client sourceId === account.id

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

  public broadcast(appState: AppState) {
    if (!this.wss) {
      console.error("--- WebSocket server not initialized.");
      return;
    }

    const sourceId = appState.account?.sourceId;
    const messageString = JSON.stringify(appState);
    //console.debug(`Broadcasting message to ${this.wss.clients.size} clients`);

    this.wss.clients.forEach((client) => {
      const clientSourceId = (client as any).sourceId
      if (!!sourceId && (sourceId !== clientSourceId)) return;

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