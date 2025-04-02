export interface AppState {
  isDarkModeEnabled: boolean,
  account?: Account,
  guestList: Guest[],
  reservations: Reservation[],
  tables: TableItemData[]
}

export const DefaultAppState: AppState = {
  isDarkModeEnabled: false,
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
  guestList: [],
  reservations:[],
  tables: []
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
  tableType: string,
  createdAt: number,
  modifiedAt?: number,
  assignedAt: number,
  partySize: number,
  extraPlayersString?: string,
  extraPlayers?: {id: number, name: string, assignedAt: number}[],
  notes: string,
  reservation?: Reservation,
}

export const DefaultGuestData: Guest = {
  id: 0,
  name: "",
  phoneNumber: "",
  tableType: "Regulation",
  createdAt: 0,
  assignedAt : 0,
  partySize: 1,
  notes: "",
}

export interface Reservation {
  date: number,
  // createdAt: number,
  // modifiedAt?: number,
}

export interface TableItemData {
  id: number,
  type: string,
  subtype: string,
  number: number,
  name: string,
  nickname?: string,
  isActive: boolean,
  guest?: Guest,
}
