import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekday from 'dayjs/plugin/weekday';

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import ReconnectingWebSocket from 'reconnecting-websocket';
import AppHeader from "../header/header";
import AppMain from "../main/main";
import styles from "./poolMasterStyles.module.css";
import { appStateAtom, isQuietModeAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import HomeRedirect from '../mainTakeover/homeRedirect/homeRedirect';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

const CONNECTION_RETRY_INTERVAL = 5000;

export default function AppPoolMaster() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [QUIET_MODE] = useAtom(isQuietModeAtom);

  const ws = useRef<ReconnectingWebSocket | null>(null);

  const initializeWebSocket = () => {
    const clientId = Math.random().toString(36).slice(2, 9);
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host; // Includes hostname and port
    const wsUrl = `${protocol}//${host}`;

    if (ws.current) {
      ws.current.onclose = null;
      ws.current.close();
      ws.current = null;
    }

    const sourceId = APP_STATE.account.id.split('-')[4];
    ws.current = new ReconnectingWebSocket(`${wsUrl}?sourceId=${sourceId}&clientId=${clientId}`);

    ws.current.onopen = () => {
      console.log("---(ws) connection established");
    };

    ws.current.onmessage = (event) => {
      if (typeof event.data === "string") {
        const appStateFromWebSocket = JSON.parse(event.data);
        setAppState(appStateFromWebSocket);
      }
    };

    ws.current.onerror = (error) => {
      setTimeout(initializeWebSocket, CONNECTION_RETRY_INTERVAL);
    };

    ws.current.onclose = (event) => {};
  };

  useEffect(() => {
    initializeWebSocket();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(`Visible at (${Date.now()}). Reconnecting ws.`);
        try {
          initializeWebSocket();
          AppStorage.getAppStateRemote().then((appState) => {
            if (appState) {
              setAppState(appState);
            }
          }).catch((error) => {
            console.error("Error fetching app state:", error);
          });
        } catch(e) {
          console.log('Error reinitializing websocket after interruption')
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Lead user to initial admin setup
    if (APP_STATE.modifiedAt === 0) {
      setMainTakeover({adminScreen: true});
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (<>
    <div className={`${QUIET_MODE && 'flex flex-col items-center justify-center grow'}`}>
      <AppHeader/>
    </div>
    {!QUIET_MODE && (
      <div className={`${styles.appContentContainer} grow overflow-y-scroll px-1 md:!px-10`}>
        <AppMain/>
      </div>
    )}
    {MAIN_TAKEOVER?.homeRedirect && <HomeRedirect></HomeRedirect>}

  </>);
}
