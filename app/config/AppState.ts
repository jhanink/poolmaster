export const DefaultTableTypeName = 'Regulation';
export const GuestItemTypeKey = 'GUEST_ITEM';
export const DEFAULT_ID = 999999999;

export interface AppState {
  account: Account,
  tableTypes: TableType[],
  tableRates: TableRate[],
  usageTypes: UsageType[],
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
  usageTypeId?: number,
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

export interface UsageType {
  id: number,
  name: string,
  isActive: boolean,
  usageRate: string,
  useIcon: boolean,
  icon: string,
  textColor: string,
  forDelete?: boolean,
  forAdd?: boolean,
}

export const DefaultTableRateData: TableRate = {
  id: DEFAULT_ID,
  name: `Default Rate Schedule`,
  tableRateRules: {
    isOneHourMinimum: true,
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
  id: DEFAULT_ID,
  name: DefaultTableTypeName,
  tableRateId: DEFAULT_ID,
  isActive: true,
  forDelete: false,
  forAdd: true,
}

export const DefaultUsageTypeData: UsageType = {
  id: DEFAULT_ID,
  name: "Regular",
  isActive: true,
  usageRate: "10.00",
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
      id: 0,
      number: 1,
      name: "Table 1",
      ignoreTableTypeRate: false,
      isActive: true,
      tableTypeId: DefaultTableTypeData.id,
      tableRateId: DEFAULT_ID,
    },
    {
      id: 1,
      tableTypeId: DefaultTableTypeData.id,
      number: 2,
      ignoreTableTypeRate: false,
      name: "Table 2",
      isActive: true,
      tableRateId: DEFAULT_ID,
    },
  ]
}
