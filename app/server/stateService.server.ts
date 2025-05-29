import type { ActionFunction, LoaderFunction } from  'react-router';
import fs from 'fs/promises';
import type { AppState } from '~/config/AppState';
import { webSocketManager } from './websocketManager';
import { appStateFilePath } from '~/config/AppConfig';

export const loader: LoaderFunction = async () => {
  try {
    const data: string = await fs.readFile(appStateFilePath, 'utf8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('----- Error getting app state:', error);
    return Response.json({ error: 'Failed to get app state' }, { status: 500 });
  }
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    try {
      const newAppState: AppState = await request.json();
      await fs.writeFile(appStateFilePath, JSON.stringify(newAppState));

      console.log('stateService');
      webSocketManager.broadcast({...newAppState});

      return Response.json(newAppState);
    } catch (error) {
      console.error('----- Error saving app state:', error);
      return Response.json({ error: 'Failed to save app state' }, { status: 500 });
    }
  }
};
