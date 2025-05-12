export const DefaultTableTypeName = 'Regulation';
export const GuestItemTypeKey = 'GUEST_ITEM';
export const DEFAULT_TABLE_RATE_ID = 999999999;
export const DEFAULT_TABLE_TYPE_ID = 999999999;;

export interface AppState {
  account: Account,
  tableTypes: TableType[],
  tableRates: TableRate[],
  guestList: Guest[],
  tables: TableItem[],
  modifiedAt: number,
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

export interface Billing {
  selectedScheduleId?: number,
  defaultBillingRate: string,
}

export interface Guest {
  id: number,
  name: string,
  phoneNumber: string,
  tableTypeId: number,
  createdAt: number,
  modifiedAt?: number,
  assignedAt: number,
  closedOutAt: number,
  partySize: number,
  extraPlayers?: ExtraPlayer[],
  notes: string,
  reservation?: Reservation,
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
  tableRateId: number,
  isActive: boolean,
  nickname?: string,
  guest?: Guest,
  forDelete?: boolean,
  forAdd?: boolean,
  closedOutAt?: number,
  createdAt?: number,
  modifiedAt?: number,
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
  hourlyRate: string,
  isChargePerPlayer: boolean,
}

export const DefaultTableRateData: TableRate = {
  id: DEFAULT_TABLE_RATE_ID,
  name: `Default Rate Schedule`,
  tableRateRules: {
    isOneHourMinimum: false,
    hourlyRate: "10.00",
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
  id: DEFAULT_TABLE_TYPE_ID,
  name: DefaultTableTypeName,
  tableRateId: DEFAULT_TABLE_RATE_ID,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultTableItemData: TableItem = {
  id: 0,
  tableTypeId: DefaultTableTypeData.id,
  number: 1,
  name: "Table 1",
  tableRateId: DEFAULT_TABLE_RATE_ID,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultAppState: AppState = {
  modifiedAt: 0,
  account: {
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
  },
  tableTypes: [DefaultTableTypeData],
  tableRates: [DefaultTableRateData],
  guestList: [],
  tables: [
    {
      id: 0,
      number: 1,
      name: "Table 1",
      isActive: true,
      tableTypeId: DefaultTableTypeData.id,
      tableRateId: DEFAULT_TABLE_RATE_ID,
    },
    {
      id: 1,
      tableTypeId: DefaultTableTypeData.id,
      number: 2,
      name: "Table 2",
      isActive: true,
      tableRateId: DEFAULT_TABLE_RATE_ID,
    },
  ]
}

export const DefaultGuestData: Guest = {
  id: 0,
  name: "",
  phoneNumber: "",
  tableTypeId: 999999999,
  createdAt: 0,
  assignedAt : 0,
  closedOutAt: 0,
  partySize: 1,
  notes: "",
}
