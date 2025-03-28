import config from '~/config/app-config.json';
import type { AppConfig } from '~/config/AppConfig';
import { type AppState, DefaultAppState } from '~/config/AppState';
import FileStorage from '../../fileStorage/app_state_file.json';

export interface AppRuntime {
  appConfig: AppConfig;
  appState: AppState;
}

export const LoaderDefault: AppRuntime = {
  appConfig: config,
  appState: DefaultAppState,
}

export const LoaderFileStorage: AppRuntime = {
  appConfig: config,

  /*
    Using "as" AppState tells the static analyzer to trust the input file.
    It is saying "treat FileStorage as if it's AppState"
  */
  appState: FileStorage as AppState,
}
