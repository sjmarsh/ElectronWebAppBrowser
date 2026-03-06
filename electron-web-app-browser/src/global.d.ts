import { IElectronAPI } from "./preload";
import { ISettingsAPI } from "./settings/preload";

declare global {
    interface Window {
        electronAPI: IElectronAPI;
        settingsAPI: ISettingsAPI;
    }
}