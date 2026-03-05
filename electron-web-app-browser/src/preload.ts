// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { IFileDialogOptions } from "./types/IFileDialogOptions";
import { ISettingsDefinition } from "./types/ISettingsDefinition";
import { ISaveSettingsResult } from "./types/ISaveSettingsResult";

export interface IElectronAPI {
    readSettings: () => Promise<string>;
    selectFile: (opts: IFileDialogOptions) => Promise<string[]>;
    saveSettings: (settings: ISettingsDefinition) => Promise<ISaveSettingsResult>;
    logConsole: (...args: any[]) => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
    readSettings: () => ipcRenderer.invoke('read-settings'),
    selectFile: (opts: IFileDialogOptions) => ipcRenderer.invoke('select-file', opts),
    saveSettings: (settings: ISettingsDefinition) => ipcRenderer.invoke('save-settings', settings),
    logConsole: (...args: any[]) => ipcRenderer.invoke('log-console', ...args)
} as IElectronAPI );