import { Locator, Page, _electron as electron, ElectronApplication } from '@playwright/test';
import { SettingsPage } from './settings-page';
import { MenuItem } from 'electron';

export class MainPage {
    readonly electronApp: ElectronApplication
    readonly page: Page
    menu: Electron.Menu | null
    settingsDialog: SettingsPage | null
      
    constructor(page: Page, electronApp: ElectronApplication) {
        this.electronApp = electronApp;
        this.page = page;    
        this.menu = null;
        this.settingsDialog = null;
    }

    initMenu = async () => {
        this.menu = await this.electronApp.evaluate(async ({ Menu }) => {
            return Menu.getApplicationMenu();
        });
    }

    topMenuLabels = () : string[] => {
        return this.menu?.items.map(item => item.label) ?? [];;
    }

    fileMenuLabels = () : string[] => {
        const fileMenu = this.menu?.items.find(item => item.label === 'File');
        return fileMenu?.submenu?.items.map(item => item.label) ?? [];       
    }

    clickSettingsMenu = async () => {
        const [settingsDialog] = await Promise.all([
                this.electronApp.waitForEvent('window'), // Wait for new BrowserWindow
                await this.electronApp.evaluate(async ({ Menu }) => {
                    const menu = Menu.getApplicationMenu();
                    const fileMenu = menu?.items.find(item => item.label === 'File');
                    await fileMenu?.click();
                    const settingsMenu = fileMenu?.submenu?.items.find(i => i.label === 'Settings');
                    settingsMenu?.click();
                })
            ]);
        
        this.settingsDialog = new SettingsPage(settingsDialog, this.electronApp);
    }

    clickSettingsButton = async () => {
        const settingsButton = this.page.getByRole('button', { name: 'Open Settings' });
        await settingsButton.click();
        const settingsWindow = await this.electronApp.waitForEvent('window');
        this.settingsDialog = new SettingsPage(settingsWindow, this.electronApp);
    }
}