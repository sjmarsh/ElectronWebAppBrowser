import { _electron as electron, test as base, expect, ElectronApplication, Page } from '@playwright/test'
import { MainPage } from './pages/main-page';

type MyFixtures = {
  electronApp: any;
  mainPage: MainPage;
};

export const test = base.extend<MyFixtures>({
    // Fixture to launch the Electron app
    electronApp: async ({}, use: any) => {
        const app = await electron.launch({ 
            executablePath: 'electron-web-app-browser.exe', 
            cwd: './out/electron-web-app-browser-win32-x64'
        });
        await use(app);
        await app.close();
    },

    mainPage: async ({ electronApp }, use) => {
        const page = await electronApp.firstWindow();
        const mainPage = new MainPage(page, electronApp);
        await mainPage.initMenu();
        use(mainPage);
    }
})