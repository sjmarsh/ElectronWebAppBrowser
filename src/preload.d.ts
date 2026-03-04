import { IFileDialogOptions } from './types/IFileDialogOptions.js';
import { ISettingsDefinition } from './types/ISettingsDefinition.js';

declare interface IContextBridgeApi {
    log: (message: string) => Promise<void>;
    logDetail: (message: string, obj: any) => Promise<void>;
    logError: (message: string) => Promise<void>;
    readSettings: () => Promise<string>;
    selectFile: (opts: IFileDialogOptions) => Promise<string[]>;
    saveSettings: (settings: ISettingsDefinition) => Promise<void>;
}