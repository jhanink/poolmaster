import fs from 'fs/promises';
import type { ActionFunction, LoaderFunction } from "react-router";
import { membersFilePath } from '~/config/AppConfig';
import type { Member } from '~/config/AppState';

export const loader: LoaderFunction = async () => {
  try {
    const data: string = await fs.readFile(membersFilePath, 'utf8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('----- Error getting members:', error);
    return Response.json({ error: 'Failed to get members' }, { status: 500 });
  }
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    try {
      const members: Member[] = await request.json();
      await fs.writeFile(membersFilePath, JSON.stringify(members));
      return Response.json(members);
    } catch (error) {
      console.error('----- Error saving members', {error, request, membersFilePath});
      return Response.json({ error: 'Failed to save memberse' }, { status: 500 });
    }
  }
};
