// check that the app is installed correctly and ready to use

import fs from 'fs-extra';
import path from 'path';

console.log('--- Starting installation...');

const projectRoot = path.resolve('.');

const appStateFile = path.join(projectRoot, '/fileStorage/app_state_file.json');
const starterFile = path.join(projectRoot, '/fileStorage/samples/app_state_file.json');

const appStateFileExists = fs.existsSync(appStateFile);

if (!appStateFileExists) {
  console.log(`--- Initializing app state file`);
  fs.copyFileSync(starterFile, appStateFile);
}

console.log('--- Installation complete.');
console.log('--- You can now start the app by running "npm run dev"');

