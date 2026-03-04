import { app, ipcMain, dialog, BrowserWindow, WebContentsView, Menu, MenuItem } from 'electron'

import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';

import logger from './simpleLogger.js';
import { IFileDialogOptions } from './types/IFileDialogOptions.js';
import { ISettingsDefinition } from './types/ISettingsDefinition.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menu = new Menu();
const submenu = Menu.buildFromTemplate([
  {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: () => {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => window.webContents.reload());
    }
  },
  {
    label: 'Settings',
    accelerator: 'F12',
    click: () => {
      openSettings();
    }
  },
  {
    label: 'Developer Tools',
    accelerator: 'CmdOrCtrl+Shift+I',
    click: () => {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => window.webContents.openDevTools());
    }
  }
]);
menu.append(new MenuItem({ label: 'File', submenu }));
Menu.setApplicationMenu(menu);

let settingsWindow: BrowserWindow | null = null;
const openSettings = async () => {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 800,
    height: 520,
    parent: BrowserWindow.getAllWindows()[0] || null,
    modal: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webviewTag: true
    }
  });
  settingsWindow.removeMenu();
  settingsWindow.loadFile(path.join(__dirname, 'renderer', 'settings.html'));
  settingsWindow.on('closed', () => { settingsWindow = null; });
};

const createWebContentsView = (): WebContentsView => {
  return new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      webviewTag: true
    }
  })
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webviewTag: true
    }
  })

  const view = createWebContentsView();
  view.setBounds({ x: 0, y: 0, width: 800, height: 600 });
  view.webContents.loadURL('https://www.google.com');

  mainWindow.contentView.addChildView(view);
  //mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) 
            logger.log('Creating new window on activate');
            createWindow()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit()
})

ipcMain.handle('log', async (event, message: string) => {
  logger.log(message);
  return { ok: true };
});

ipcMain.handle('log-detail', async (event, message: string, obj: any) => {
  logger.logDetail(message, obj);
  return { ok: true };
});

ipcMain.handle('log-error', async (event, message: string) => {
  logger.error(message);
  return { ok: true };
});

ipcMain.handle('read-settings', async () => {
  const candidates = [
    path.join(process.cwd(), 'settings.json')
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf8');
      }
    } catch (e) {
      // ignore and continue
    }
  }
  return null;
});

ipcMain.handle('select-file', async (event, opts: IFileDialogOptions) => {
  console.log('select-file', opts);
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: opts?.filters || [] });
  if (result.canceled || !result.filePaths || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('save-settings', async (event, settings: ISettingsDefinition) => {
  try {
    const outPath = path.join(process.cwd(), 'settings.json');
    await fs.promises.writeFile(outPath, typeof settings === 'string' ? settings : JSON.stringify(settings, null, 2), 'utf8');
    return { ok: true, path: outPath };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});
