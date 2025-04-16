import dayjs from "dayjs";
import {type AppState, type Guest} from "~/config/AppState";

export type TimeElapsed = {
  durationMinutes: number;
  durationHoursDecimal: string;
  minutes: number;
  hours: number;
  days: number;
}
export const InitialTimeElapsed: TimeElapsed = {
  minutes: 0,
  hours: 0,
  days: 0,
  durationMinutes: 0,
  durationHoursDecimal: '0.00'
};

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
  timeElapsed: (start: number, finish?: number): TimeElapsed => {
    const end = finish || Date.now();
    const durationMinutes = Math.floor((end - start) / (1000 * 60));
    const duration = dayjs.duration({ minutes: durationMinutes });
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());
    const minutes = durationMinutes % 60;
    const durationHoursDecimal = `${(Math.floor(duration.asHours() * 100) / 100).toFixed(2)}`;
    return {
      durationMinutes,
      durationHoursDecimal,
      minutes: minutes >= 0 ? minutes : 0,
      hours,
      days,
    }
  },
  timeElapsedGuest: (guest: Guest) => {
    return Helpers.timeElapsed(guest.createdAt, Date.now());
  }
}
