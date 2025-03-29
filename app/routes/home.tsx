import type { Route } from "./+types/home";
import AppPoolMaster from "./components/poolMaster/poolMaster";
import { useAtom } from "jotai";
import { appConfigAtom, appReadyAtom, appStateAtom } from "~/appStateGlobal/atoms";
import { useLoaderData, type LoaderFunction } from "react-router";
import { type AppRuntime }  from "~/config/AppRuntime";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { appStateFilePath } from "~/config/AppConfig";
import fs from 'fs/promises';
import { type AppState } from "~/config/AppState";
import type { AppConfig } from '~/config/AppConfig';
import config from '~/config/app-config.json';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pool Master" },
    { name: "description", content: "Pool Hall Management" },
  ];
}

export const loader: LoaderFunction = async () => {
  const fileData: string = await fs.readFile(appStateFilePath, 'utf8');
  const fileAppState: AppState = JSON.parse(fileData);
  return Response.json({
    appConfig: config as AppConfig,
    appState: fileAppState as AppState,
  });
}

export default function Home() {
  const { appConfig, appState } = useLoaderData<AppRuntime>();

  const [, setAppConfig] = useAtom(appConfigAtom);
  const [, setAppState] = useAtom(appStateAtom);
  const [appReady, setAppReady] = useAtom(appReadyAtom);

  useEffect(() => {
    if (appReady) return;
    setAppConfig(appConfig);
    setAppState(appState);
    setAppReady(true);
  }, [appReady, appConfig, setAppConfig, setAppReady]);


  return <>
    <DndProvider backend={HTML5Backend}>
      {appReady && <AppPoolMaster />}
    </DndProvider>
  </>
}
