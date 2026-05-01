import { expect } from '@playwright/test'
import { test } from '../fixture'
import fs from 'fs';
import path from 'path';

import { MainPage } from '../pages/main-page';
import { ISettingsDefinition } from '../../src/types/ISettingsDefinition';

const settingsFilePath = path.join(__dirname, '../../out/electron-web-app-browser-win32-x64/settings.json');

const clearSavedSettingsFile = () => {
    // Check if file exists before trying to delete it
    if (fs.existsSync(settingsFilePath)) {
        fs.unlinkSync(settingsFilePath);
        console.log(`Deleted file: ${settingsFilePath}`);
    }
    else {
        console.log('file does not exist');
    }
}

const waitForSettingsToSave = async () => {
    await expect.poll(() => fs.existsSync(settingsFilePath), {
        message: 'File did not save in time',
        timeout: 10000,
        }).toBeTruthy();
}

const openSettings = async (mainPage: MainPage) => {
    await mainPage.clickSettingsButton();
    expect(mainPage.settingsDialog).toBeDefined();
    expect(mainPage.settingsDialog?.isVisible).toBeTruthy();
}

const closeSettings = async (mainPage: MainPage) => {
    expect(mainPage.settingsDialog).toBeDefined();
    expect(mainPage.settingsDialog?.isVisible).toBeTruthy();
    await mainPage.settingsDialog?.close();
}

const testSettings = {
    AppDisplayName: 'The App',
    AppPath: 'c:/temp/theApp/',
    ExecutableName: 'theApp.exe',
    HideConsoleWindow: true,
    AppUrl: 'http://localhost:1234',
    AppIcon: 'c:/temp/theApp/theApp.ico'
 } as ISettingsDefinition

test.describe('Settings Tests', () => {

    test.beforeEach(async ({mainPage}) => {
        await openSettings(mainPage);
    });

    test.afterEach(async ({mainPage}) => {
        await closeSettings(mainPage);
        clearSavedSettingsFile(); // using beforeEach is too late as application will try to use settings on launch
    });

    test('it should have empty settings on first load', async ({mainPage}) => {
        expect(await mainPage.settingsDialog?.webAppDisplayNameText()).toBe('');
        expect(await mainPage.settingsDialog?.webAppRootPathText()).toBe('');
        expect(await mainPage.settingsDialog?.webAppExecutableText()).toBe('');
        expect(await mainPage.settingsDialog?.hideConsoleWindowIsChecked()).toBeFalsy;
        expect(await mainPage.settingsDialog?.webAppUrlText()).toBe('');
        expect(await mainPage.settingsDialog?.webAppIconText()).toBe('');
    });


    test.only('it should save valid settings', async ({mainPage}) => {
        await mainPage.settingsDialog?.enterWebAppDisplayNameText(testSettings.AppDisplayName);
        await mainPage.settingsDialog?.enterWebAppRootPathText(testSettings.AppPath);
        await mainPage.settingsDialog?.enterWebAppExecutableText(testSettings.ExecutableName);
        await mainPage.settingsDialog?.checkHideConsoleWindow(testSettings.HideConsoleWindow);
        await mainPage.settingsDialog?.enterWebAppUrlText(testSettings.AppUrl);
        await mainPage.settingsDialog?.enterWebAppIconText(testSettings.AppIcon);

        expect(await mainPage.settingsDialog?.saveSettingsButtonText()).toContain('Save Settings');

        await mainPage.settingsDialog?.saveSettingsButtonClick();
        expect(await mainPage.settingsDialog?.saveSettingsButtonText()).toContain('Saved');
        await waitForSettingsToSave();
        await mainPage.settingsDialog?.cancelButtonClick();

        await mainPage.clickSettingsButton(false);
        
        expect(await mainPage.settingsDialog?.webAppDisplayNameText()).toBe(testSettings.AppDisplayName);
        expect(await mainPage.settingsDialog?.webAppRootPathText()).toBe(testSettings.AppPath);
        expect(await mainPage.settingsDialog?.webAppExecutableText()).toBe(testSettings.ExecutableName);
        expect(await mainPage.settingsDialog?.hideConsoleWindowIsChecked()).toBe(testSettings.HideConsoleWindow)
        expect(await mainPage.settingsDialog?.webAppUrlText()).toBe(testSettings.AppUrl);
        expect(await mainPage.settingsDialog?.webAppIconText()).toBe(testSettings.AppIcon);
    });
});
