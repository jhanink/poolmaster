import path from 'node:path';

export interface AppConfig {
  accountId: number
}

// Dynamically resolve the project root
const projectRoot = path.resolve('.');

// Construct the path to the state file relative to the project root
export const appStateFilePath = path.join(projectRoot, '/fileStorage/app_state_file.json');
