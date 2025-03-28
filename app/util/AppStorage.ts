import { type AppRuntime, LoaderDefault, LoaderFileStorage } from "~/config/AppRuntime";
import type { AppState, Guest } from "~/config/AppState";

export interface AppStorageInterface {
  getLoaderAppRuntime: () => Response;
  getAppStateRemote: () => Promise<AppState>;
  setAppStateRemote: (newAppState: AppState) => Promise<AppState>;
  saveGuestRemote: (guest: Guest) => Promise<AppState>;
  deleteGuestRemote(guestId: number): Promise<AppState>;
  assignToTableRemote: (data: {tableId: number, guestId: number}) => Promise<AppState>;
  toggleDarkModeRemote: (isDarkModeEnabled: boolean) => Promise<AppState>;
}

export const AppStorage: AppStorageInterface = {
  saveGuestRemote: async (data: Guest): Promise<AppState> => {
    return requestPOST(data, '/services/save-guest');
  },
  assignToTableRemote: async (data: {tableId: number, guestId: number}): Promise<AppState> => {
    return requestPOST(data, '/services/assign-guest');
  },
  deleteGuestRemote: async (guestId: number): Promise<AppState> => {
    return requestPOST({guestId}, '/services/delete-guest');
  },
  toggleDarkModeRemote: async (data: boolean): Promise<AppState> => {
    return requestPOST(data, '/services/toggle-dark-mode');
  },
  getLoaderAppRuntime:  () => {
    const loaderAppRuntime: AppRuntime = {
      ...LoaderDefault,
      ...LoaderFileStorage,
    }
    return Response.json(loaderAppRuntime);
  },
  getAppStateRemote: async (): Promise<AppState> => {
    return await requestGET('/services/storage');
  },
  setAppStateRemote: async (newAppState: AppState): Promise<AppState> => {
    return await requestPOST(newAppState, '/services/storage');
  },
};

const requestGET = async (serviceUrl: string): Promise<AppState> => {
  return await request(null, serviceUrl, 'GET');
};

const requestPOST = async (data: any, serviceUrl: string): Promise<AppState> => {
  return await request(data, serviceUrl);
};

const request = async (data: any, serviceUrl: string, method: string = 'POST'): Promise<AppState> => {
  try {
    const response = await fetch(serviceUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(data? {body: JSON.stringify(data)} : {}),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return new Promise(resolve => resolve(response.json()));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`----- Error ${method === 'GET' ? 'fetching' : 'saving'} remote app state:`, {error, data});
    return new Promise(resolve => resolve(null));
  }
}