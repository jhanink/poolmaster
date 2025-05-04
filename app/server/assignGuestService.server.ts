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

const handleAssignment = (fileAppState: AppState, requestData: {tableId: number, guestId: number}): AppState => {
  const guestList = fileAppState.guestList;
  const tables = fileAppState.tables;

  // Assignment:
  const newGuestList = guestList.filter((guest: Guest) => guest.id !== requestData.guestId);
  const guest = guestList.find((guest) => guest.id === requestData.guestId);
  const NOW = Date.now();
  if (guest) {
    guest.assignedAt = NOW;
    guest.extraPlayers = guest.extraPlayers.map((extraPlayer) => {
      return {
        ...extraPlayer,
        assignedAt: NOW,
      };
    });
  }

  // Re-Assignment:
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