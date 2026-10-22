// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IFileDialogOptions } from "./types/IFileDialogOptions";
import { ISettingsDefinition } from "./types/ISettingsDefinition";
import { ISaveSettingsResult } from "./types/ISaveSettingsResult";

console.log('Preload script loaded.');

export interface IElectronAPI {
    selectFile: (ops: IFileDialogOptions) => Promise<string[] | null>;
    readSettings: () => Promise<ISettingsDefinition | null>;
    saveSettings: (settings: ISettingsDefinition) => Promise<ISaveSettingsResult>;
    openSettingsWindow: () => void;
    closeSettingsWindow: () => void;
    log: (message: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logDetail: (message: string, obj: any) => void;
    logError: (message: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logErrorDetail: (message: string, err: any) => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
    readSettings: () => ipcRenderer.invoke('read-settings'),
    selectFile: (ops: IFileDialogOptions) => ipcRenderer.invoke('select-file', ops),
    saveSettings: (settings: ISettingsDefinition) => ipcRenderer.invoke('save-settings', settings),
    openSettingsWindow: () => ipcRenderer.invoke('open-settings-window'),
    closeSettingsWindow: () => ipcRenderer.invoke('close-settings-window'),
    log: (message: string) => ipcRenderer.invoke('log', message),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logDetail: (message: string, obj: any) => ipcRenderer.invoke('log-detail', message, obj),
    logError: (message: string)=> ipcRenderer.invoke('log-error', message),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logErrorDetail: (message: string, err: any)=> ipcRenderer.invoke('log-error-detail', message, err),
} as IElectronAPI );