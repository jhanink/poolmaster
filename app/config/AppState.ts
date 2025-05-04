export interface AppState {
  account: Account,
  billing: Billing,
  guestList: Guest[],
  tables: TableItemData[],
  modifiedAt: number,
}

export const DefaultTableType = 'Regulation';
export const GuestItemTypeKey = 'GUEST_ITEM';

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
  billing: {
    maxBillablePlayers: 5,
    defaultBillingRate: "10.00",
  },
  guestList: [],
  tables: [
    {
      id: 0,
      type: DefaultTableType,
      number: 1,
      name: "Table 1",
      tableRate: "10.00",
      isActive: true,
    },
    {
      id: 1,
      type: DefaultTableType,
      number: 2,
      name: "Table 2",
      tableRate: "10.00",
      isActive: true,
    },
  ]
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
  maxBillablePlayers: number,
  defaultBillingRate: string,
}

export interface Guest {
  id: number,
  name: string,
  phoneNumber: string,
  tableType: string,
  createdAt: number,
  modifiedAt?: number,
  assignedAt: number,
  closedOutAt: number,
  partySize: number,
  extraPlayersString?: string,
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

export const DefaultGuestData: Guest = {
  id: 0,
  name: "",
  phoneNumber: "",
  tableType: "Regulation",
  createdAt: 0,
  assignedAt : 0,
  closedOutAt: 0,
  partySize: 1,
  notes: "",
}

export interface Reservation {
  date: number,
}

export interface TableItemData {
  id: number,
  type: string,
  number: number,
  name: string,
  tableRate: string,
  createdAt?: number,
  modifiedAt?: number,
  isActive: boolean,
  nickname?: string,
  guest?: Guest,
  subtype?: string, // TODO: remove this
  forDelete?: boolean,
  forAdd?: boolean,
  closedOutAt?: number,
}
