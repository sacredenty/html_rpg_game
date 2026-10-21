const { test, expect } = require('@playwright/test');
const { startNewAdventure } = require('./helpers');

test.describe('Game UI', () => {
    test.beforeEach(async ({ page }) => {
        await startNewAdventure(page);
    });

    test('shows the active hero status', async ({ page }) => {
        await expect(page.locator('#player-name')).toHaveText('TestHero · Warrior');
        await expect(page.locator('#difficulty-display')).toHaveText('Medium');
        await expect(page.locator('#hp-display')).toHaveText(/^\d+\/\d+$/);
        await expect(page.locator('#mp-display')).toHaveText(/^\d+\/\d+$/);
        await expect(page.locator('#level-display')).toHaveText('1');
        await expect(page.locator('#xp-bar')).toBeVisible();
    });

    test('shows the map, inventory, quests, and game actions', async ({ page }) => {
        await expect(page.locator('#gameCanvas')).toBeVisible();
        await expect(page.locator('#inventory-list')).toBeVisible();
        await expect(page.locator('#accepted-quests-container')).toBeVisible();
        await expect(page.locator('.actions-panel')).toBeVisible();

        for (const button of ['#explore-btn', '#attack-btn', '#rest-btn', '#save-btn', '#load-btn']) {
            await expect(page.locator(button)).toBeVisible();
        }
    });
});
