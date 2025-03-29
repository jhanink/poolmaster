import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import ReconnectingWebSocket from 'reconnecting-websocket';
import AppFooter from "../footer/footer";
import AppHeader from "../header/header";
import AppMain from "../main/main";
import styles from "./poolMasterStyles.module.css";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

export default function AppPoolMaster() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);

  const ws = useRef<ReconnectingWebSocket | null>(null);

  // Function to initialize the WebSocket connection
  const initializeWebSocket = () => {
    const clientId = Math.random().toString(36).slice(2, 9);
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host; // Includes hostname and port
    const wsUrl = `${protocol}//${host}`;

    // Close the existing WebSocket if it exists
    if (ws.current) {
      ws.current.onclose = null;
      ws.current.close();
      ws.current = null;
    }

    ws.current = new ReconnectingWebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("---(ws) connection established");
      ws.current?.send(`Client/${clientId}`); // Send a message to the server
    };

    ws.current.onmessage = (event) => {
      //console.log("---(ws) Message received:", event.data);
      if (typeof event.data === "string") {
        const appStateFromWebSocket = JSON.parse(event.data);
        setAppState(appStateFromWebSocket);
      }
    };

    ws.current.onerror = (error) => {
      //console.error("---(ws) WebSocket error:", error);
      setTimeout(initializeWebSocket, 5000); // Attempt to reconnect after 5 seconds
    };

    ws.current.onclose = (event) => {
      //console.log("---(ws) WebSocket connection closed:", event.code, event.reason);
    };
  };

  useEffect(() => {
    // Initialize WebSocket on component mount
    initializeWebSocket();

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(`Visible at (${Date.now()}). Reconnecting ws.`);
        try {
          initializeWebSocket(); // Reconnect WebSocket when the page becomes visible
          // AppStorage.getAppStateRemote().then((appState) => {
          //   if (appState) {
          //     setAppState(appState);
          //   }
          // }).catch((error) => {
          //   console.error("Error fetching app state:", error);
          // });
        } catch(e) {
          console.log('Error reinitializing websocket after interruption')
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      //console.log("---(ws) Cleanup: closing WebSocket");
      if (ws.current) {
        ws.current.close();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array: runs only once on mount

  return (
    <>
      <div className={`${styles.appOuterContainer}`}>
        <AppHeader />
        <div className={`${styles.appContentContainer}`}>
          <AppMain />
        </div>
        <AppFooter />
      </div>
    </>
  );
}