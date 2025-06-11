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
    webSocketManager.broadcast({...newAppState});
    return Response.json(newAppState);
  } catch (error) {
    console.error('----- [assignGuestService.ts] Error:');
    return Response.json({ error: 'Failed to save app state' }, { status: 500 });
  }
};

const handleAssignment = (fileAppState: AppState, requestData: {tableId: number, guestId: number, assignedAt: number}): AppState => {
  const guestList = fileAppState.guestList;
  const tables = fileAppState.tables;

  const newGuestList = guestList.filter((guest: Guest) => guest.id !== requestData.guestId);
  const newGuest = guestList.find((guest) => guest.id === requestData.guestId);
  const fromTable = tables.find(table => table.guest?.id === requestData.guestId);
  const toTable = tables.find(table => table.id === requestData.tableId);

  if (newGuest) {
    toTable.guest = newGuest;
    const assignedAt = requestData.assignedAt;
    newGuest.assignedAt = assignedAt;
    const NOW = Date.now();
    newGuest.extraPlayers = newGuest.extraPlayers.map((extraPlayer) => {
      return {
        ...extraPlayer,
        assignedAt,
      };
    });
  } else {
    toTable.guest = fromTable.guest;
    fromTable.guest = undefined;
  }

  return {
    ...fileAppState,
    guestList: newGuestList,
    tables,
  };
}
