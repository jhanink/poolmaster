import { atom } from "jotai";
import type { AppConfig }  from "~/config/AppConfig";
import  { DefaultAppState, type AppState, type Guest, type TableItem } from "~/config/AppState";
import appConfig from "~/config/app-config.json";

export type ListFilterType = "waitlist" | "tablelist" | '';

export enum ListFilterTypeEnum {
  WAITLIST = "waitlist",
  TABLELIST = "tablelist",
  NONE = ''
}

export type MainTakeover = {
  adminScreen?: boolean,
  closeoutTable?: TableItem,
  assignTableGuest?: Guest,
  addGuest?: boolean,
  editGuest?: Guest,
  reservationsScreen?: boolean,
  homeRedirect?: boolean,
}

export const mainTakoverAtom = atom<MainTakeover | undefined>(undefined as MainTakeover);

export const appStateAtom = atom<AppState>(DefaultAppState);
export const appConfigAtom = atom<AppConfig>(appConfig);
export const appReadyAtom = atom<boolean>(false);
export const profileMenuOpenAtom = atom<boolean>(false);
export const selectedTableAtom = atom<TableItem | undefined>(undefined as TableItem);
export const selectedListFilterAtom = atom<ListFilterType>('');
export const guestExpandAllAtom = atom<boolean>(false);
export const tableExpandAllAtom = atom<boolean>(false);
export const manageTablesAtom = atom<boolean>(false);
export const isSavingAtom = atom<boolean>(false);
export const isQuietModeAtom = atom<boolean>(false);
