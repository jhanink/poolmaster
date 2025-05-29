import type { ActionFunction } from  'react-router';
import fs from 'fs/promises';

import type { AppState, Guest, TableItem} from '~/config/AppState';
import { webSocketManager } from "./websocketManager";
import { appStateFilePath } from '~/config/AppConfig';

export const action: ActionFunction = async ({ request }) => {
  try {
    const requestData = await request.json();
    const fileData: string = await fs.readFile(appStateFilePath, 'utf8');
    const fileAppState: AppState = JSON.parse(fileData);
    const newAppState = mergeToGuestList(fileAppState, requestData);
    await fs.writeFile(appStateFilePath, JSON.stringify(newAppState));
    webSocketManager.broadcast({...newAppState});
    return Response.json(newAppState);
  } catch (error) {
    console.error('----- [saveGuestService.ts] Error:', error);
    return Response.json({ error: 'Failed to save app state' }, { status: 500 });
  }
};

const mergeToGuestList = (fileAppState: AppState, guest: Guest): AppState => {
  const guestList: Guest[] = [...fileAppState.guestList];
  const tables: TableItem[] = [...fileAppState.tables];
  const NOW = Date.now();
  if (!guest.id) {
    guestList.push({
      ...guest,
      id: NOW,
      createdAt: NOW,
      assignedAt: 0,
    });
  } else {
    if (!guest.assignedAt) {
      const itemIndex = guestList.findIndex((item: Guest) => item.id === guest.id);
      guestList[itemIndex] = guest;
    } else{
      const itemIndex = tables.findIndex((item: TableItem) => item.guest?.id === guest.id);
      tables[itemIndex].guest = guest;
      guest.extraPlayers.forEach((player) => {
        if (!player.assignedAt) {
          player.assignedAt = NOW;
        }
      });
    }
  }

  return {
    ...fileAppState,
    guestList: guestList,
    tables,
  };
}
