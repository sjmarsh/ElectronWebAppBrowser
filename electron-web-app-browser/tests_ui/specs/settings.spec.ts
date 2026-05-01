import { expect } from '@playwright/test'
import { test } from '../fixture'
import { MainPage } from '../pages/main-page';

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

test('it should have empty settings on first load', async ({mainPage}) => {
    await openSettings(mainPage);
       
    expect(await mainPage.settingsDialog?.webAppDisplayNameText()).toBe('');
    expect(await mainPage.settingsDialog?.webAppRootPathText()).toBe('');
    expect(await mainPage.settingsDialog?.webAppExecutableText()).toBe('');
    expect(await mainPage.settingsDialog?.hideConsoleWindowIsChecked()).toBeFalsy;
    expect(await mainPage.settingsDialog?.webAppUrlText()).toBe('');
    expect(await mainPage.settingsDialog?.webAppIconText()).toBe('');

    await closeSettings(mainPage);
})
