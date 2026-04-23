import { _electron as electron, test, ElectronApplication, Page } from '@playwright/test'

let electronApp: ElectronApplication
let page: Page

test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.']});
    page = await electronApp.firstWindow();
})

// simple 'do nothing' test to ensure test framework is working
test('launch app', async () => {    
    await page.screenshot({path: './test-results/launch_app.png'});
});

test.afterAll(async () => {
    await electronApp.close();
})