import { app, ipcMain, BrowserWindow, WebContentsView } from 'electron'

import path from 'path'
import { fileURLToPath } from 'url';

import logger from './simpleLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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