const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  log: (message: string) => ipcRenderer.invoke('log', message),
  logDetail: (message: string, obj: any) => ipcRenderer.invoke('log-detail', message, obj),
  logError: (message: string) => ipcRenderer.invoke('log-error', message),
  readSettings: () => ipcRenderer.invoke('read-settings'),
  selectFile: (opts: any) => ipcRenderer.invoke('select-file', opts),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
});