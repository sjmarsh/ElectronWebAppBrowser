import { _electron as electron, test, expect, ElectronApplication, Page } from '@playwright/test'

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

test('it should display menu', async () => {
    await page.keyboard.press('Alt');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
})

test('it should have expected menu item', async () => {
    
    const menuLabels = await electronApp.evaluate(async ({ Menu }) => {
        const menu = Menu.getApplicationMenu();
        return menu?.items.map(item => item.label);
    });
    expect(menuLabels).toHaveLength(1);
    expect(menuLabels).toContain('File');
})

test('it should have expected sub menu items', async () => {
    const subMenuLabels = await electronApp.evaluate(async ({ Menu }) => {
        const menu = Menu.getApplicationMenu();
        const fileMenu = menu?.items.find(item => item.label === 'File');
        await fileMenu?.click();
        return fileMenu?.submenu?.items.map(item => item.label);
    });

    expect(subMenuLabels).toHaveLength(3);
    expect(subMenuLabels).toContain('Reload');
    expect(subMenuLabels).toContain('Settings');
    expect(subMenuLabels).toContain('Developer Tools');
})

test.afterAll(async () => {
    await electronApp.close();
})