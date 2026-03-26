import { ChildProcess, spawn } from 'child_process';
import path from 'path'
import fs from 'fs';

import settingsService from './settingsService';
import simpleLogger from '../utils/simpleLogger';
import isUp from '../utils/isUp';

let webAppProcess : ChildProcess | null = null;

const startWebApp = async (): Promise<boolean> => {
  simpleLogger.log('Starting Web App');
  let isStarted = false;
  const settings = await settingsService.readSettings();
  if(settings) {
    isStarted = await isUp(settings.AppUrl);
    if(isStarted) {
      simpleLogger.log(`Web App is already running at ${settings.AppUrl}`);
    }
    else {
      if(settings.AppPath && settings.ExecutableName) {
        
        if(process.platform === 'linux' || process.platform === 'win32') {
          const out = fs.openSync(path.join(__dirname, 'out.log'), 'a');
          const err = fs.openSync(path.join(__dirname, 'out.log'), 'a');
          try {
            const exePath = path.join(settings.AppPath, settings.ExecutableName);
            simpleLogger.log(`Attempting to start Web App API Service at ${exePath} on ${process.platform} platform.`);
            webAppProcess = spawn(exePath, { 
              cwd: settings.AppPath,
              shell: !settings.HideConsoleWindow,
              detached: true,
              stdio: [ 'ignore', out, err ]
            });
            webAppProcess.unref();
            simpleLogger.log(`Spawned child proces with PID: ${webAppProcess.pid}`);
            isStarted = true;
          } catch(error) {
            simpleLogger.errorDetail("Failed to spawn child process", error);
          }    
        }
        else {
          simpleLogger.error(`Platform: ${process.platform} is not supported.`);
        }

      }
    }
    
    return isStarted;
  }
  else {
    simpleLogger.error('Settings were not available.  Cannot start Web App.');
    return false;
  }
}

const clearWebAppProcess = () => {
    if(webAppProcess) {
        webAppProcess.kill();
        webAppProcess = null;
    }
}

export default {
    startWebApp,
    clearWebAppProcess
}