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

    webAppDisplayNameText = async () : Promise<string> => {
        const locator = this.page.locator('#txtAppDisplayName');
        return await locator.innerText();
    }

    webAppRootPathText = async () : Promise<string> => {
        const locator = this.page.locator('#txtAppPath');
        return await locator.innerText();
    }

    webAppExecutableText = async () : Promise<string> => {
        const locator = this.page.locator('#txtExecutableName');
        return await locator.innerText();
    }

    hideConsoleWindowIsChecked = async () : Promise<boolean> => {
        const locator = this.page.locator('#chkHideConsoleWindow')
        return await locator.isChecked();
    }

    webAppUrlText = async () : Promise<string> => {
        const locator = this.page.locator('#txtAppUrl');
        return await locator.innerText();
    }

    webAppIconText = async () : Promise<string> => {
        const locator = this.page.locator('#txtAppIcon');
        return await locator.innerText();
    }
}