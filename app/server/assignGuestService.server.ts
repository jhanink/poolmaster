import type { ActionFunction } from  'react-router';
import fs from 'fs/promises';
import type { AppState, Guest} from '~/config/AppState';
import { webSocketManager } from "./websocketManager";
import { appStateFilePath } from '~/config/AppConfig';

export const action: ActionFunction = async ({ request }) => {
  try {
    const requestData = await request.json();
    const fileData: string = await fs.readFile(appStateFilePath, 'utf8');
    const fileAppState: AppState = JSON.parse(fileData);
    const newAppState = handleAssignment(fileAppState, requestData);
    await fs.writeFile(appStateFilePath, JSON.stringify(newAppState));

    console.log('assignGuestService')
    webSocketManager.broadcast({...newAppState});

    return Response.json(newAppState);
  } catch (error) {
    console.error('----- [assignGuestService.ts] Error:');
    return Response.json({ error: 'Failed to save app state' }, { status: 500 });
  }
};

const handleAssignment = (fileAppState: AppState, requestData: {tableId: number, guestId: number}): AppState => {
  const guestList = fileAppState.guestList;
  const tables = fileAppState.tables;

  // if moving from wait list to a table, remove from table and record assignment time
  const newGuestList = guestList.filter((guest: Guest) => guest.id !== requestData.guestId);
  const guest = guestList.find((guest) => guest.id === requestData.guestId)
  if (guest) {
    guest.assignedAt = Date.now();
  }

  // if re-assigning, remove from current table and then assign to new table
  const currentTable = tables.find(table => table.guest?.id === requestData.guestId);
  const newTable = tables.find(table => table.id === requestData.tableId);

  if (newTable) {
    newTable.guest = currentTable ? currentTable.guest : guest;
  }

  if (currentTable) {
    currentTable.guest = undefined;
  }

  return {
    ...fileAppState,
    guestList: newGuestList,
    tables,
  };
}