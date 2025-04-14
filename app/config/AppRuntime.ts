import config from '~/config/app-config.json';
import type { AppConfig } from '~/config/AppConfig';
import { type AppState, DefaultAppState } from '~/config/AppState';

export interface AppRuntime {
  appConfig: AppConfig;
  appState: AppState;
}

export const LoaderDefault: AppRuntime = {
  appConfig: config,
  appState: DefaultAppState,
}
