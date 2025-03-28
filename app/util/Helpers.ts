import {type AppState} from "~/config/AppState";

export const Helpers = {
  tablesAvailable: (appState: AppState) => {
    return appState.tables.filter(table => table.isActive && !table.guest);
  },
  tablesAssigned: (appState: AppState) => {
    return appState.tables.filter(table => table.isActive && table.guest);
  },
  percentAvailableTables: (appState: AppState) => {
    return Math.round(Helpers.tablesAvailable(appState).length / appState.tables.length * 100);
  },
  reservations: (appState: AppState) => {
    return appState.tables.filter(table => table.guest?.reservation);
  }
}