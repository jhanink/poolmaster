import dayjs from "dayjs";
import {type AppState, type Guest} from "~/config/AppState";

export type TimeElapsed = {
  durationMinutes: number;
  durationHoursDecimal: string;
  durationHoursDecimal2: string;
  durationHoursDecimal3: string;
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
  durationHoursDecimal: '0.00',
  durationHoursDecimal2: '0.00',
  durationHoursDecimal3: '0.000',
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
  getTableType: (appState: AppState, tableTypeId: number) => {
    const match = appState.tableTypes.find(tableType => {
      return tableType.id === tableTypeId;
    });
    if (!match) {
      return appState.tableTypes[0];
    }
    return match;
  },
  timeElapsed: (start: number, finish?: number): TimeElapsed => {
    const end = finish || Date.now();
    const duration = dayjs.duration({milliseconds: end - start});
    const durationMinutes = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());
    const minutes = durationMinutes % 60;
    const hoursExact = duration.asHours();
    const durationHoursDecimal = Helpers.formatHoursDecimal(hoursExact, 1);
    const durationHoursDecimal2 = Helpers.formatHoursDecimal(hoursExact, 2);
    const durationHoursDecimal3 = Helpers.formatHoursDecimal(hoursExact, 3);
    return {
      durationMinutes,
      durationHoursDecimal,
      durationHoursDecimal2,
      durationHoursDecimal3,
      hoursExact,
      minutes: minutes >= 0 ? minutes : 0,
      hours,
      days,
    }
  },
  formatHoursDecimal: (hoursExact: number, decimals: number = 2) => {
    hoursExact.toFixed(decimals);
    return `${hoursExact.toFixed(decimals)}`;
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
  percentTablesAssigned: (appState: AppState) => {
    return Math.round(Helpers.tablesAssigned(appState).length / appState.tables.length * 100);
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
