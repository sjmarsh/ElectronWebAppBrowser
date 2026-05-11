import { Locator, Page, ElectronApplication } from '@playwright/test';

export class SettingsPage {
    readonly electronApp: ElectronApplication
    readonly page: Page

    constructor(page: Page, electronApp: ElectronApplication) {
        this.electronApp = electronApp;
        this.page = page;    
    }
    
    isVisible = () => {
        return !this.page.isHidden('#txtAppDisplayName');
    }

    close = async () => {
        await this.page.close();
    }

    private webAppDisplayName = () : Locator => {
        return this.page.locator('#txtAppDisplayName');  // note: find by label was not working so reverted to ids
    }
    webAppDisplayNameText = async () : Promise<string> => {
        const locator = this.webAppDisplayName();
        return await locator.inputValue(); 
    }

    enterWebAppDisplayNameText = async (text: string) => {
        const locator = this.webAppDisplayName();
        await locator.fill(text);
    }

    private webAppRootPath = () : Locator => {
        return this.page.locator('#txtAppPath');
    }

    webAppRootPathText = async () : Promise<string> => {
        const locator = this.webAppRootPath();
        return await locator.inputValue();
    }

    enterWebAppRootPathText = async (text: string) => {
        const locator = this.webAppRootPath();
        await locator.fill(text);
    }

    private webAppExecutable = () : Locator => {
        return this.page.locator('#txtExecutableName');
    }

    webAppExecutableText = async () : Promise<string> => {
        const locator = this.webAppExecutable();
        return await locator.inputValue();
    }

    enterWebAppExecutableText = async (text: string) => {
        const locator = this.webAppExecutable();
        await locator.fill(text);
    }

    private hideConsoleWindowCheckBox = () : Locator => {
        return this.page.locator('#chkHideConsoleWindow')
    }

    hideConsoleWindowIsChecked = async () : Promise<boolean> => {
        const locator = this.hideConsoleWindowCheckBox();
        return await locator.isChecked();
    }

    checkHideConsoleWindow = async (isChecked: boolean) => {
        const locator = this.hideConsoleWindowCheckBox();
        await locator.setChecked(isChecked);
    }

    private webAppUrl = () : Locator => {
        return this.page.locator('#txtAppUrl');
    }

    webAppUrlText = async () : Promise<string> => {
        const locator = this.webAppUrl();
        return await locator.inputValue();
    }

    enterWebAppUrlText = async (text: string) => {
        const locator = this.webAppUrl();
        await locator.fill(text);
    }

    private webAppIcon = () : Locator => {
        return this.page.locator('#txtAppIcon');
    }

    webAppIconText = async () : Promise<string> => {
        const locator = this.webAppIcon();
        return await locator.inputValue();
    }

    enterWebAppIconText = async (text: string) => {
        const locator = this.webAppIcon();
        await locator.fill(text);
    }

    private saveSettingsButton = () : Locator => {
        return this.page.locator('#btnSaveSettings');
    }

    saveSettingsButtonText = async () : Promise<string> => {
        const locator = this.saveSettingsButton();
        return await locator.textContent() ?? '';
    }

    saveSettingsButtonClick = async () => {
        const locator = this.saveSettingsButton();
        await locator.click();
    }

    cancelButtonClick = async () => {
        const locator = this.page.locator('#btnCancel');
        await locator.click();
    }
}