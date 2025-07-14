import dayjs from "dayjs";
import {EXPIRED_VISIT_HOURS, SyntheticTableTypeAny, SystemConfig, WEEK_DAYS, type AppState, type BillablePlayer, type ExtraPlayer,
  type Guest, type MeteredDay, type MeteredTime, type PlayerRateRules,
  type ScheduleEntry, type TableItem, type TableRate, type TableRateRules
} from "~/config/AppState";

export const DAYJS_DATE_FORMAT = 'MMM D, h:mm a';
export const DAYJS_DAY_FORMAT = 'MMM D';
export const DAYJS_TIME_FORMAT = 'h:mm a';

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
  tables: (appState: AppState) =>
    appState.tables.filter(table => table.isActive).sort((a:TableItem, b:TableItem) => a.number - b.number),
  tableTypes: (appState: AppState) =>
    appState.tableTypes.filter(tableType => tableType.isActive),
  tablesAvailable: (appState: AppState) =>
    Helpers.tables(appState).filter(table => !table.guest),
  tablesAssigned: (appState: AppState) =>
    Helpers.tables(appState).filter(table => table.guest),
  tablesExpired: (appState: AppState) =>
    appState.tables.filter(table => Helpers.isExpiredVisit(table.guest)),
  hasGuests: (appState: AppState) => appState.guestList.length > 0,
  reservationsToday: (appState: AppState) => [],
  getTable: (appState: AppState, tableId: number) =>
    Helpers.tables(appState).find(table => table.id === tableId)|| appState.tables[0],
  getTableType: (appState: AppState, tableTypeId: number) =>
    Helpers.tableTypes(appState).find(tableType => tableType.id === tableTypeId) || SyntheticTableTypeAny,
  getTableOrTableType: (appState: AppState, guest: Guest) =>
    guest.prefersTable ? Helpers.getTable(appState, guest.tableOrTableTypeId) : Helpers.getTableType(appState, guest.tableOrTableTypeId),
  getTablePreference: (appState: AppState, guest: Guest) =>
    guest.prefersTable
      ? `${Helpers.getTable(appState, guest.tableOrTableTypeId).name}`
      : `${Helpers.getTableType(appState, guest.tableOrTableTypeId).name}`,
  getUsageType: (appState: AppState, usageTypeId: number) =>
    appState.usageTypes.find(usageType => usageType.id === usageTypeId) || appState.usageTypes[0],
  getRateSchedule: (appState: AppState, rateScheduleId: number) => {
    const match = appState.rateSchedules.find(rateSchedule => rateSchedule.id === rateScheduleId);
    return (match.isActive && match) || appState.rateSchedules[0];
  },
  getMeteredDay: (appState: AppState, tableRate: TableRate, guest: Guest) => {
    const debug = Helpers.debug;
    const assignedAt = dayjs(guest.assignedAt);
    const closedOutAt = dayjs(guest.closedOutAt);
    const businessDay = Helpers.getBusinessDay(appState, guest.assignedAt);
    const tableRateRules: TableRateRules = tableRate.tableRateRules;
    const useRateSchedule = tableRateRules.useRateSchedule;
    const schedule = useRateSchedule && Helpers.getRateSchedule(appState, tableRateRules.rateScheduleId);
    const daySchedule: ScheduleEntry = schedule && schedule.entries[WEEK_DAYS[businessDay]];

    const T: any = {assignedAt, closedOutAt};

    if (daySchedule) {
      // subtract offset to get correct day. Then set
      let _ = daySchedule.start.split(':');
      T.start =  dayjs().subtract(appState.businessDayOffsetHours, 'hours').hour(Number(_[0])).minute(Number(_[1]));
      _ = daySchedule.end.split(':');
      T.end =  dayjs().subtract(appState.businessDayOffsetHours, 'hours').hour(Number(_[0])).minute(Number(_[1]));
      /*
        CASES
          1. [] < start
          2. [ < start < ] < end
          3. [ < start < end < ]
          4. start < [] < end
          5. start < [ < end ]
          6. start < end < []
      */
      if (T.assignedAt.isBefore(T.start)) {
        if (T.closedOutAt.isBefore(T.start)) {
          T.windowScenario = 1;
          T.before = {
            hours: T.closedOutAt.diff(T.assignedAt, 'hours', true),
            rate: daySchedule.rateBefore,
            elapsed: Helpers.timeElapsed(T.assignedAt, T.closedOutAt).durationHoursDecimal3,
          }
        } else {
          T.before = {
            hours: T.start.diff(T.assignedAt, 'hours', true),
            rate: daySchedule.rateBefore,
            elapsed: Helpers.timeElapsed(T.assignedAt, T.start).durationHoursDecimal3,
          };
          if (T.closedOutAt.isBefore(T.end)) {
            T.windowScenario = 2;
            T.during = {
              hours: T.closedOutAt.diff(T.start, 'hours', true),
              rate: daySchedule.rateDuring,
              elapsed: Helpers.timeElapsed(T.start, T.closedOutAt).durationHoursDecimal3,
            };
          } else {
            T.windowScenario = 3;
            T.during = {
              hours: T.end.diff(T.start, 'hours', true),
              rate: daySchedule.rateDuring,
              elapsed: Helpers.timeElapsed(T.start, T.end).durationHoursDecimal3,
            };
            T.after = {
              hours: T.closedOutAt.diff(T.end, 'hours', true),
              rate: daySchedule.rateAfter,
              elapsed: Helpers.timeElapsed(T.end, T.closedOutAt).durationHoursDecimal3,
            }
          }
        }
      }
      if (T.assignedAt.isAfter(T.start)) {
        if (T.closedOutAt.isBefore(T.end)) {
          T.windowScenario = 4;
          T.during = {
            hours: T.closedOutAt.diff(T.assignedAt, 'hours', true),
            rate: daySchedule.rateDuring,
            elapsed: Helpers.timeElapsed(T.assignedAt, T.closedOutAt).durationHoursDecimal3,
          };
        } else {
          T.windowScenario = 5;
          T.during = {
            hours: T.end.diff(T.assignedAt, 'hours', true),
            rate: daySchedule.rateDuring,
            elapsed: Helpers.timeElapsed(T.assignedAt, T.end).durationHoursDecimal3,
          };
          T.after = {
            hours: T.closedOutAt.diff(T.end, 'hours', true),
            rate: daySchedule.rateAfter,
            elapsed: Helpers.timeElapsed(T.end, T.closedOutAt).durationHoursDecimal3,
          };
        }
      }
      if (T.assignedAt.isAfter(T.end)) {
        T.windowScenario = 6;
        T.after = {
          hours: T.end.diff(T.start, 'hours', true),
          rate: daySchedule.rateAfter,
          elapsed: Helpers.timeElapsed(T.start, T.end).durationHoursDecimal3,
        };
      }
    }
    const meteredDay: MeteredDay = {
      before: T.before && {hours: T.before.elapsed, rate: T.before.rate},
      during: T.during && {hours: T.during.elapsed, rate: T.during.rate},
      after: T.after && {hours: T.after.elapsed, rate: T.after.rate},
      rate1hrMin: daySchedule.rate1HrMin,
      businessDay,
      daySchedule,
      T
    };
    return meteredDay;
  },
  getBusinessDay: (appState: AppState, assignedAt: number) => {
    const businessDayOffsetHours = appState.businessDayOffsetHours;
    const businessDay = dayjs(new Date(assignedAt)).subtract(businessDayOffsetHours, 'hour');
    return businessDay.day();
  },
  getBillablePlayers: (APP_STATE: AppState, table: TableItem, businessDay: number, tableRate: TableRate) => {
    const guest: Guest = table.guest;

    const playerRateRules: PlayerRateRules = tableRate.playerRateRules;
    const tableRateRules: TableRateRules = tableRate.tableRateRules;
    const useRateSchedule = tableRateRules.useRateSchedule;
    const schedule = useRateSchedule && Helpers.getRateSchedule(APP_STATE, tableRateRules.rateScheduleId);
    const daySchedule: ScheduleEntry = schedule && schedule.entries[WEEK_DAYS[businessDay]];

    const start = guest.assignedAt;
    const end = guest.closedOutAt;
    const time: TimeElapsed = Helpers.timeElapsed(start, end);
    const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;

    const hourlyRate = tableRateRules.hourlyRate;
    const isChargePerPlayer = tableRateRules.isChargePerPlayer;
    const playerLimit = playerRateRules.playerLimit;
    const afterLimitRate = playerRateRules.afterLimitRate;

    const PLAYERS_COUNT = isChargePerPlayer ? Math.max(guest.partySize, guest.extraPlayers.length + 1) : 1;
    const players: BillablePlayer[] = [];

    for (let i = 0; i < (PLAYERS_COUNT); i++) {
      const rate = (isChargePerPlayer && (i >= playerLimit)) ? afterLimitRate : hourlyRate;
      players.push({
        id: i,
        name: `Player ${i + 1}`,
        hours,
        rate,
        daySchedule,
        meteredDay: Helpers.getMeteredDay(APP_STATE, tableRate, guest),
        billable: true,
        isAddedPlayer: false,
        usePlayerTime: false,
        assignedAt: guest.assignedAt,
      } as BillablePlayer);
    }
    players[0].name = guest.name.toUpperCase();

    guest.extraPlayers.forEach((player: ExtraPlayer, index) => {
      const playersIndex = index + 1;
      if (playersIndex > players.length - 1) return;
      players[playersIndex].name = player.name.toUpperCase();
      players[playersIndex].isAddedPlayer = true;
      players[playersIndex].usePlayerTime = true;
      players[playersIndex].assignedAt = player.assignedAt;

      // NOTE: Added Players:  Player-Assignment TIME !== Table-Assignment TIME
      const time = Helpers.timeElapsed(player.assignedAt, guest.closedOutAt);
      const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
      players[playersIndex].hours = hours;
    });

    return players;
  },
  isExpiredVisit: (guest: Guest) => {
    const startTime = guest.assignedAt || guest.createdAt;
    if (!startTime) return false;
    const NOW = Date.now();
    return (NOW - startTime) >= EXPIRED_VISIT_HOURS;
  },
  isEmptyListData: (appState: AppState) => {
    return !Helpers.hasGuests(appState) && !Helpers.tablesAssigned(appState).length;
  },
  tableRateSuffix: (tableRate: TableRate) => {
    const temp = [];
    if (!tableRate.tableRateRules.isChargePerPlayer) {
      temp.push('S');
    }
    if (tableRate.tableRateRules.isFlatRate) {
      temp.push('F');
    }
    if (temp.length) return `(${temp.join(', ')})`;
    return '';
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
  formatHoursDecimal: (hoursExact: number, decimals: number = 2) => `${hoursExact.toFixed(decimals)}`,
  timeElapsedGuest: (guest: Guest) => Helpers.timeElapsed(guest.createdAt, Date.now()),
  timeElapsedTable: (guest: Guest) => Helpers.timeElapsed(guest.assignedAt, Date.now()),
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
  formatDate: (date: number) => dayjs(date).format(DAYJS_DATE_FORMAT),
  formatDay: (date: number) => dayjs(date).format(DAYJS_DAY_FORMAT),
  formatTime: (date: number) => dayjs(date).format(DAYJS_TIME_FORMAT),
  percentTablesAssigned: (appState: AppState) => Math.round(Helpers.tablesAssigned(appState).length / Helpers.tables(appState).length * 100),
  percentTablesAvailable: (appState: AppState) => Math.round(Helpers.tablesAvailable(appState).length / Helpers.tables(appState).length * 100),
  pluralizeTablesAssigned: (appState: AppState) => `table${Helpers.tablesAssigned(appState).length === 1 ? '' : 's'}`,
  pluralizeTablesAvailable: (appState: AppState) => `table${Helpers.tablesAvailable(appState).length === 1 ? '': 's'}`,
  pluralizeGuestsWaiting: (appState: AppState) => `guest${appState.guestList.length === 1 ? '' : 's'}`,
  showTableListCards: (appState: AppState) => appState.adminSettings.showTableListCards,
  debug: (obj: any) => SystemConfig.DEBUG && console.log(obj),
}
