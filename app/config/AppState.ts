export const GuestItemTypeKey = 'GUEST_ITEM';
export const DEFAULT_ID = 999999999;
export const SYNTHETIC_DEFAULT_ID = 888888888;
export const SYNTHETIC_MAP_KEY = -1;
export const ID_1 = 1, ID_2 = 2, ID_3 = 3, ID_4 = 4, ID_5 = 5, ID_6 = 6, ID_7 = 7, ID_8 = 8;
export const MAX_PARTY_SIZE = 20;
export const MIN_LARGE_PARTY_SIZE = 3;
export const PARTY_SIZE_ARRAY = Array.from({length: MAX_PARTY_SIZE}, (_, i) => i + 1);
export const LARGE_PARTY_SIZE_ARRAY = Array.from({length: MAX_PARTY_SIZE - (MIN_LARGE_PARTY_SIZE - 1) }, (_, i) => i + MIN_LARGE_PARTY_SIZE);
export const DEFAULT_TEXT_COLOR = '#EFEFEF';
export const EXPIRED_VISIT_HOURS = 1000 * 60 * 60 * 10;
export const EXPIRED_ASSIGNED_HOURS = 1000 * 60 * 60 * 20;

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const POS_PROVIDERS = [{
  id: 1,
  key: 'PROVIDER_SQUARE',
  name: 'Square',
}];

export const FeatureFlags = {
  SHOW_RESERVATIONS: false,
  SHOW_MAIN_SWIMLANES: true,
  SHOW_WELCOME_MESSAGE: false,
}

export const SystemConfig = {
  LOG_CONNECTED_CLIENTS: false,
  DEBUG: true,
  DEBUG_UI: false,
}

export interface AppState {
  account: Account,
  tableTypes: TableType[],
  tableRates: TableRate[],
  usageTypes: UsageType[],
  rateSchedules: RateSchedule[],
  guestList: Guest[],
  reservations: Guest[],
  tables: TableItem[],
  modifiedAt: number,
  adminSettings: AdminSettings,
  businessDayOffsetHours: number,
}

export interface AdminSettings {
  largePartySize: number,
  largePartyStyle: number,
  showTableChipInfo: boolean,
  showTableListCards: boolean,
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

export interface Member {
  id: string,
  name: string,
  first_name: string,
  last_name: string,
  phone_numnber: string,
  email: string,
  photo_file: string;
  createdAt: number,
  modifiedAt?: number,
}

export interface Membership {
  id: string,
  name: string,
  description: string,
  discount_id: string,
}

export interface Discount {
  id: string,
  name: string,
  description: string,
}
export interface Discounts {}

export interface POSIntegration {
  apiKey: string,
}

export interface SquareIntegration extends POSIntegration  {

}

export interface Guest {
  id: number,
  name: string,
  phoneNumber: string,
  prefersTable: boolean,
  tableOrTableTypeId: number,
  assignedAt: number,
  closedOutAt: number,
  partySize: number,
  extraPlayers?: ExtraPlayer[],
  notes: string,
  isReservation?: boolean,
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
  start: string,
  end: string,
  rateBefore: string,
  rateAfter: string,
  rateDuring: string,
  rate1HrMin: string,
}

export interface MeteredTime {
  hours: string,
  rate: string,
}

export interface MeteredDay {
  before: MeteredTime,
  during: MeteredTime,
  after: MeteredTime,
  rate1hrMin: string,
  businessDay: number,
  daySchedule: ScheduleEntry,
  T: any,
}

export interface BillablePlayer {
  id: number,
  name: string,
  hours: string,
  rate: string,
  daySchedule: ScheduleEntry,
  meteredDay: MeteredDay,
  billable: boolean,
  isAddedPlayer?: boolean,
  usePlayerTime?: boolean,
  assignedAt?: number,
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
  show: boolean,
  forDelete?: boolean,
  forAdd?: boolean,
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
  iconOnly: boolean,
  textColor: string,
  showIconPicker?: boolean,
  showColorPicker?: boolean,
  forDelete?: boolean,
  forAdd?: boolean,
}

export const DefaultSettings: AdminSettings = {
  largePartySize: 20,
  largePartyStyle: ID_1,
  showTableChipInfo: false,
  showTableListCards: false,
}

export const RateScheduleDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DefaultRateSchedule: RateSchedule = {
  id: DEFAULT_ID,
  name: "USE TABLE RATE",
  entries: {
    Mon: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Tue: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Wed: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Thu: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Fri: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Sat: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },
    Sun: {
      start: "00:00",
      end: "23:59",
      rateBefore: "0.00",
      rateAfter: "0.00",
      rateDuring: "10.00",
      rate1HrMin: "10.00",
    },

  },
  isActive: true,
  forDelete: false,
  forAdd: true,
  show: true,
}

export const DefaultTableRateData: TableRate = {
  id: DEFAULT_ID,
  name: `Regular Rate`,
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
  id: SYNTHETIC_DEFAULT_ID,
  name: "ANY",
  tableRateId: DEFAULT_ID,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const SyntheticTableTypeAny: TableType = DefaultTableTypeData;

export const DefaultUsageTypeData: UsageType = {
  id: DEFAULT_ID,
  name: "NONE",
  isActive: true,
  tableRateId: DEFAULT_ID,
  useIcon: false,
  icon: "",
  iconOnly: false,
  textColor: "",
  forDelete: false,
  forAdd: true,
}

export const DefaultTableItemData: TableItem = {
  id: 0,
  number: 1,
  name: "Table 1",
  tableTypeId: DEFAULT_ID,
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
  prefersTable: false,
  tableOrTableTypeId: SYNTHETIC_DEFAULT_ID,
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
  businessDayOffsetHours: 4,
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
      forDelete: false,
      forAdd: true,
    }
  ],
  rateSchedules: [
    {
      ...DefaultRateSchedule,
      forDelete: false,
      forAdd: true,
    }
  ],
  usageTypes: [
    {
      ...DefaultUsageTypeData,
      forAdd: false,
    }
  ],
  guestList: [],
  reservations: [],
  tables: [
    {
      id: 1,
      number: 1,
      name: "Table 1",
      isActive: true,
      tableTypeId: DEFAULT_ID,
      ignoreTableTypeRate: false,
      tableRateId: DEFAULT_ID,
    },
    {
      id: 2,
      number: 2,
      name: "Table 2",
      isActive: true,
      tableTypeId: DEFAULT_ID,
      ignoreTableTypeRate: false,
      tableRateId: DEFAULT_ID,
    },
  ],
  adminSettings: {
    ...DefaultSettings,
  }
}
