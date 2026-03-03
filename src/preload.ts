import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  log: (message: string) => ipcRenderer.invoke('log', message),
  logDetail: (message: string, obj: any) => ipcRenderer.invoke('log-detail', message, obj),
  logError: (message: string) => ipcRenderer.invoke('log-error', message)
 
});