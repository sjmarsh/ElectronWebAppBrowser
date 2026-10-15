import { ChildProcess, spawn } from 'child_process';
import path from 'path'
import fs from 'fs';

import { IWebAppServiceStatus } from '../types/IWebAppServiceStatus.js';
import settingsService from './settingsService';
import simpleLogger from '../utils/simpleLogger';
import isUp from '../utils/isUp';

let webAppProcess : ChildProcess | null = null;

const startWebApp = async (): Promise<IWebAppServiceStatus> => {
  simpleLogger.log('Starting Web App');
  const status: IWebAppServiceStatus = {
    isRunning: false
  }
  const settings = await settingsService.readSettings();
  if(settings) {
    status.isRunning = await isUp(settings.AppUrl);
    if(status.isRunning) {
      simpleLogger.log(`Web App is already running at ${settings.AppUrl}`);
    }
    else {
      if(settings.AppPath && settings.ExecutableName) {
        if(process.platform === 'linux' || process.platform === 'win32') {
          try {        
            const out = fs.openSync(path.join(process.cwd(), 'out.log'), 'a');
            const err = fs.openSync(path.join(process.cwd(), 'err.log'), 'a');
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
            status.isRunning = true;
          } catch(error) {
            status.error = `Failed to spawn child process. ${error}`;
          }    
        }
        else {
          status.error = `Platform: ${process.platform} is not supported.`;
        }
      }
    }
  }
  else {
    status.error = 'Settings were not available.  Cannot start Web App.';
  }
  return status;
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