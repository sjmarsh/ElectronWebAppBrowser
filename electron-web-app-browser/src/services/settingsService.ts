import path from 'path'
import fs from 'fs';

import { ISettingsDefinition } from '../types/ISettingsDefinition.js';
import { ISaveSettingsResult } from '../types/ISaveSettingsResult.js';
import simpleLogger from '../utils/simpleLogger';

let settingsCache: ISettingsDefinition | null = null;

const readSettings = async () : Promise<ISettingsDefinition | null> => {
  if(settingsCache) {
    simpleLogger.log('Using cached settings');
    return settingsCache;
  }
  else {
    simpleLogger.log('Reading settings from file');
    const candidates = [
      path.join(process.cwd(), 'settings.json')
    ];

    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          const settingsString =  fs.readFileSync(p, 'utf8');
          simpleLogger.logDetail('Settings String: ', settingsString);
          if(settingsString && settingsString.length > 0){
            let parsed = null;
            try { 
              parsed = JSON.parse(settingsString); 
            } catch (e) { 
              parsed = null; 
              simpleLogger.errorDetail('Unable to parse settings.', e);
            }
            if(parsed) {
              settingsCache = {
                AppDisplayName: parsed.AppDisplayName || parsed.appDisplayName || '',
                AppPath: parsed.AppPath || parsed.appPath || '',
                ExecutableName: parsed.ExecutableName || parsed.executableName || '',
                HideConsoleWindow: parsed.HideConsoleWindow || false,
                AppUrl: parsed.AppUrl || parsed.appUrl || '',
                AppIcon: parsed.AppIcon || parsed.appIcon || ''
              } as ISettingsDefinition
              simpleLogger.logDetail('Typed/Mapped settings: ', settingsCache);
              return settingsCache;
            }
          }
        }
        else {
          simpleLogger.error(`Settings file not found at: ${p}`);
        }
      } catch (e) {
        simpleLogger.errorDetail('Unable to read settings file.', e);
      }
    }
    return null;
  }  
}

const saveSettings = async (settings: ISettingsDefinition) => {
    try {
    const outPath = path.join(process.cwd(), 'settings.json');
    await fs.promises.writeFile(outPath, typeof settings === 'string' ? settings : JSON.stringify(settings, null, 2), 'utf8');
    return { ok: true, path: outPath } as ISaveSettingsResult;
  } catch (err) {
    return { ok: false, error: String(err) } as ISaveSettingsResult;
  }
}

const clearSettings = () => {
    if(settingsCache) {
        settingsCache = null;
    }
}

export default {
    readSettings,
    saveSettings,
    clearSettings
}