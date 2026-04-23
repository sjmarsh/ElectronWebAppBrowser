import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: './tests_ui',
    testIgnore: './src/**/*.spec.ts',
    timeout: 10000,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    }
})