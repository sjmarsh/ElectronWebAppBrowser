// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IFileDialogOptions } from "./types/IFileDialogOptions";
import { ISettingsDefinition } from "./types/ISettingsDefinition";
import { ISaveSettingsResult } from "./types/ISaveSettingsResult";

export interface IElectronAPI {
    logConsole: (...args: any[]) => void;
    selectFile: (ops: IFileDialogOptions) => Promise<string[] | null>;
    readSettings: () => Promise<ISettingsDefinition | null>;
    saveSettings: (settings: ISettingsDefinition) => Promise<ISaveSettingsResult>;
    openSettingsWindow: () => void;
    closeSettingsWindow: () => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
    logConsole: (...args: any[]) => ipcRenderer.invoke('log-console', ...args),
    readSettings: () => ipcRenderer.invoke('read-settings'),
    selectFile: (ops: IFileDialogOptions) => ipcRenderer.invoke('select-file', ops),
    saveSettings: (settings: ISettingsDefinition) => ipcRenderer.invoke('save-settings', settings),
    openSettingsWindow: () => ipcRenderer.invoke('open-settings-window'),
    closeSettingsWindow: () => ipcRenderer.invoke('close-settings-window')
} as IElectronAPI );