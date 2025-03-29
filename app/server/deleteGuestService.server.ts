import type { ActionFunction } from  'react-router';
import fs from 'fs/promises';
import path from 'path';
import type { AppState, Guest} from '~/config/AppState';
import { webSocketManager } from './websocketManager';
import { appStateFilePath } from '~/config/AppConfig';

export const action: ActionFunction = async ({ request }) => {
  let requestData = await request.json();
  try {
    const fileData: string = await fs.readFile(appStateFilePath, 'utf8');
    const fileAppState: AppState = JSON.parse(fileData);
    const newAppState = handleDelete(fileAppState, requestData);
    await fs.writeFile(appStateFilePath, JSON.stringify(newAppState));

    //console.log('deleteGuestService')
    webSocketManager.broadcast({...newAppState});

    return Response.json(newAppState);
  } catch (error) {
    console.error('----- [deleteGuestService.ts] Error:', error, requestData);
    return Response.json({ error: 'Failed to save app state' }, { status: 500 });
  }
};

const handleDelete = (fileAppState: AppState, requestData: {guestId: number}): AppState => {
  //console.log({id: requestData.guestId})
  const guestList = fileAppState.guestList;
  const tables = fileAppState.tables;

  const newGuestList = guestList.filter((item: Guest) => item.id !== requestData.guestId);
  const table = tables.find(table => table.guest?.id === requestData.guestId);
  if (table) {
    table.guest = undefined;
  }

  return {
    ...fileAppState,
    guestList: newGuestList,
  };
}