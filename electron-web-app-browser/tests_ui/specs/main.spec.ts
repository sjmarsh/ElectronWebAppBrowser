import { expect } from '@playwright/test'
import { test } from '../fixture'

test.describe('Main Window Tests', () => {
    // simple 'do nothing' test to ensure test framework is working
    test('launch app', async ({page}) => {    
        await page.screenshot({path: './test-results/launch_app.png'});
    });

    test('it should have expected menu item', ({mainPage}) => {
        const menuLabels = mainPage.topMenuLabels();
        expect(menuLabels).toHaveLength(1);
        expect(menuLabels).toContain('File');
    });

    test('it should have expected file menu items', ({mainPage}) => {
        const fileMenuLabels = mainPage.fileMenuLabels();
        expect(fileMenuLabels).toHaveLength(3);
        expect(fileMenuLabels).toContain('Reload');
        expect(fileMenuLabels).toContain('Settings');
        expect(fileMenuLabels).toContain('Developer Tools');
    });

    test('it should display settings dialog on menu click', async ({mainPage}) => {
        await mainPage.clickSettingsMenu()
        expect(mainPage.settingsDialog).toBeDefined();
        expect(mainPage.settingsDialog?.isVisible).toBeTruthy();
        await mainPage.settingsDialog?.close();
    });

    test('it should display settings dialog on button click', async ({mainPage}) => {
        await mainPage.clickSettingsButton()
        expect(mainPage.settingsDialog).toBeDefined();
        expect(mainPage.settingsDialog?.isVisible).toBeTruthy();
        await mainPage.settingsDialog?.close();
    });

});
