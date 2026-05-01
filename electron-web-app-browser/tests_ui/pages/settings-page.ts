import { Locator, Page, _electron as electron, ElectronApplication } from '@playwright/test';

export class SettingsPage {
    readonly electronApp: ElectronApplication
    readonly page: Page

    constructor(page: Page, electronApp: ElectronApplication) {
        this.electronApp = electronApp;
        this.page = page;    
    }
    
    isVisible = () => {
        return this.page.isVisible;
    }

    close = async () => {
        await this.page.close();
    }
}