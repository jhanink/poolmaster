import { atom } from "jotai";
import type { AppConfig }  from "~/config/AppConfig";
import  { DefaultAppState, type AppState, type Guest, type TableItemData } from "~/config/AppState";
import appConfig from "~/config/app-config.json";

export type ListFilterType = "waitlist" | "tablelist" | '';
export enum ListFilterTypeEnum {
  WAITLIST = "waitlist",
  TABLELIST = "tablelist",
  NONE = ''
}

export const appStateAtom = atom<AppState>(DefaultAppState);
export const appConfigAtom = atom<AppConfig>(appConfig);
export const appReadyAtom = atom<boolean>(false);
export const guestFormOpenAtom = atom<boolean>(false);
export const profileMenuOpenAtom = atom<boolean>(false);
export const selectedTableAtom = atom<TableItemData | undefined>(undefined as TableItemData);
export const selectedListFilterAtom = atom<ListFilterType>('');
export const dndGuestToAssignTableAtom = atom<Guest | undefined>(undefined as Guest);
export const guestCheckoutAtom = atom<TableItemData | undefined>(undefined as TableItemData);
export const adminScreenAtom = atom<boolean>(false);
