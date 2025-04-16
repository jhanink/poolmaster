import dayjs from "dayjs";
import {type AppState, type Guest} from "~/config/AppState";

export type TimeElapsed = {
  durationMinutes: number;
  durationHoursDecimal: string;
  hoursExact: number;
  minutes: number;
  hours: number;
  days: number;
}
export const InitialTimeElapsed: TimeElapsed = {
  minutes: 0,
  hours: 0,
  days: 0,
  hoursExact: 0,
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
    const hoursExact = duration.asHours();
    const durationHoursDecimal = Helpers.formatHoursDecimal(hoursExact);
    return {
      durationMinutes,
      durationHoursDecimal,
      hoursExact,
      minutes: minutes >= 0 ? minutes : 0,
      hours,
      days,
    }
  },
  formatHoursDecimal: (hoursExact: number, decimals: number = 2) => {
    return `${(Math.floor(hoursExact * 100) / 100).toFixed(decimals)}`;
  },
  timeElapsedGuest: (guest: Guest) => {
    return Helpers.timeElapsed(guest.createdAt, Date.now());
  },
  averageWaitTime: (appState: AppState) => {
    const totalWaitTime = appState.guestList.reduce((sum, guest) => {
      const timeElapsed = Helpers.timeElapsedGuest(guest);
      sum += timeElapsed.durationMinutes;
      return sum;
    }, 0);
    const averageWaitTimeMinutes = totalWaitTime / (appState.guestList.length || 1);
    if (averageWaitTimeMinutes > 60) {
      return `${Helpers.formatHoursDecimal(averageWaitTimeMinutes/60, 1)} hrs`
    }
    return `${Math.round(averageWaitTimeMinutes)} min`;
  },
  pluralizeTablesAssigned: (appState: AppState) => {
    return `table${Helpers.tablesAssigned(appState).length === 1 ? '' : 's'}`
  },
  pluralizeTablesAvailable: (appState: AppState) => {
    return `table${Helpers.tablesAvailable(appState).length === 1 ? '': 's'}`
  },
  pluralizeGuestsWaiting: (appState: AppState) => {
    return `guest${appState.guestList.length === 1 ? '' : 's'}`;
  },
}
