export const DefaultTableTypeName = 'Regulation';
export const GuestItemTypeKey = 'GUEST_ITEM';
export const DEFAULT_ID = 999999999;
export const ID_1 = 1;
export const ID_2 = 2;
export const ID_3 = 3;
export const ID_4 = 4;
export const ID_5 = 5;
export const MAX_PARTY_SIZE = 20;
export const MIN_LARGE_PARTY_SIZE = 3;
export const PARTY_SIZE_ARRAY = Array.from({length: MAX_PARTY_SIZE}, (_, i) => i + 1);
export const LARGE_PARTY_SIZE_ARRAY = Array.from({length: MAX_PARTY_SIZE - (MIN_LARGE_PARTY_SIZE - 1) }, (_, i) => i + MIN_LARGE_PARTY_SIZE);
export const DEFAULT_TEXT_COLOR = '#EFEFEF';

export interface AppState {
  account: Account,
  tableTypes: TableType[],
  tableRates: TableRate[],
  usageTypes: UsageType[],
  guestList: Guest[],
  tables: TableItem[],
  modifiedAt: number,
  statusBar: StatusBar,
}

export interface StatusBar {
  largePartySize: number,
  largePartyStyle: number,
}

export interface Account {
  id: string,
  sourceId: string,
  name: string,
  avatar: string,
  initials: string,
  phone: string,
  address: string,
  venue: string,
  email: string,
  password: string,
  createdAt: number,
  modifiedAt?: number,
}

export interface Guest {
  id: number,
  name: string,
  phoneNumber: string,
  tableTypeId: number,
  assignedAt: number,
  closedOutAt: number,
  partySize: number,
  extraPlayers?: ExtraPlayer[],
  notes: string,
  usageTypeId?: number,
  createdAt: number,
  modifiedAt?: number,
}

export interface ExtraPlayer {
  id: number,
  name: string,
  forDelete?: boolean,
  forAdd?: boolean,
  assignedAt: number,
  timeStoppedAt?: number,
}

export interface Reservation {
  date: number,
}

export interface TableType {
  id: number,
  name: string,
  tableRateId: number,
  isActive: boolean,
  forDelete?: boolean,
  forAdd?: boolean,
}

export interface TableItem {
  id: number,
  number: number,
  name: string,
  tableTypeId: number,
  ignoreTableTypeRate: boolean,
  tableRateId: number,
  isActive: boolean,
  guest?: Guest,
  forDelete?: boolean,
  forAdd?: boolean,
  closedOutAt?: number,
  createdAt?: number,
  modifiedAt?: number,
}

export interface ScheduleEntry {
  from: string,
  to: string,
  rateBefore: string,
  rateAfter: string,
  rateDuring: string,
}

export interface RateSchedule {
  id: number,
  name: string,
  entries: {
    Mon: ScheduleEntry,
    Tue: ScheduleEntry,
    Wed: ScheduleEntry,
    Thu: ScheduleEntry,
    Fri: ScheduleEntry,
    Sat: ScheduleEntry,
    Sun: ScheduleEntry,
  }
  isActive: boolean,
}

export interface TableRate {
  id: number,
  name: string,
  tableRateRules: TableRateRules,
  playerRateRules?: PlayerRateRules,
  isActive: boolean,
  forDelete?: boolean,
  forAdd?: boolean,
}

export interface PlayerRateRules {
  playerLimit: number,
  afterLimitRate: string,
}

export interface TableRateRules {
  isOneHourMinimum: boolean,
  isFlatRate: boolean,
  hourlyRate: string,
  rateScheduleId: number,
  useRateSchedule: boolean,
  isChargePerPlayer: boolean,
}

export interface UsageType {
  id: number,
  name: string,
  isActive: boolean,
  tableRateId: number,
  useIcon: boolean,
  icon: string,
  textColor: string,
  showIconPicker?: boolean,
  showColorPicker?: boolean,
  forDelete?: boolean,
  forAdd?: boolean,
}

export const DefaultStatusBar: StatusBar = {
  largePartySize: 20,
  largePartyStyle: ID_1,
}

export const DefaultRateSchedule: RateSchedule = {
  id: DEFAULT_ID,
  name: "Default Rate Schedule",
  entries: {
    Mon: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Tue: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Wed: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Thu: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Fri: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Sat: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },
    Sun: {
      from: "00:00",
      to: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
    },

  },
  isActive: false,
}

export const DefaultTableRateData: TableRate = {
  id: DEFAULT_ID,
  name: `Default Table Rate`,
  tableRateRules: {
    isOneHourMinimum: true,
    isFlatRate: false,
    hourlyRate: "10.00",
    rateScheduleId: DEFAULT_ID,
    useRateSchedule: false,
    isChargePerPlayer: false,
  } as TableRateRules,
  playerRateRules: {
    playerLimit: 0,
    afterLimitRate: "10.00",
  } as PlayerRateRules,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultTableTypeData: TableType = {
  id: DEFAULT_ID,
  name: DefaultTableTypeName,
  tableRateId: DEFAULT_ID,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultUsageTypeData: UsageType = {
  id: DEFAULT_ID,
  name: "-- USE TABLE RATE --",
  isActive: true,
  tableRateId: DEFAULT_ID,
  useIcon: false,
  icon: "",
  textColor: "",
  forDelete: false,
  forAdd: true,
}

export const DefaultTableItemData: TableItem = {
  id: 0,
  tableTypeId: DefaultTableTypeData.id,
  number: 1,
  name: "Table 1",
  tableRateId: DEFAULT_ID,
  ignoreTableTypeRate: false,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultGuestData: Guest = {
  id: 0,
  name: "",
  phoneNumber: "",
  tableTypeId: DEFAULT_ID,
  createdAt: 0,
  assignedAt : 0,
  closedOutAt: 0,
  partySize: 1,
  notes: "",
}

export const DefaultAccountData: Account = {
  id: "bfe2158d-7d95-470c-a92c-4b1d0ae4aa52",
    sourceId: "4b1d0ae4aa52",
    name: "Shane Van Boening",
    avatar: "https://avatars.githubusercontent.com/u/1000000?v=4",
    initials: "SVB",
    email: "",
    phone: "",
    address: "",
    venue: "South Dakota Billiards",
    password: "password",
    createdAt: 0,
    modifiedAt: 0
}

export const DefaultAppState: AppState = {
  modifiedAt: 0,
  account: {
    ...DefaultAccountData
  },
  tableTypes: [
    {
      ...DefaultTableTypeData,
      forAdd: false,
    }
  ],
  tableRates: [
    {
      ...DefaultTableRateData,
      forAdd: false,
    }
  ],
  usageTypes: [
    {
      ...DefaultUsageTypeData,
      forAdd: false,
    }
  ],
  guestList: [],
  tables: [
    {
      id: 1,
      number: 1,
      name: "Table 1",
      isActive: true,
      tableTypeId: DefaultTableTypeData.id,
      ignoreTableTypeRate: false,
      tableRateId: DEFAULT_ID,
    },
    {
      id: 2,
      number: 2,
      name: "Table 2",
      isActive: true,
      tableTypeId: DefaultTableTypeData.id,
      ignoreTableTypeRate: false,
      tableRateId: DEFAULT_ID,
    },
  ],
  statusBar: {
    ...DefaultStatusBar,
  }
}
