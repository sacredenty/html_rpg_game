const { test, expect } = require('@playwright/test');
const { clickNPC, startNewAdventure } = require('./helpers');

test.describe('Quest system', () => {
    test.beforeEach(async ({ page }) => {
        await startNewAdventure(page);
    });

    test('keeps available quests hidden until the player visits the king', async ({ page }) => {
        const interactionPanel = page.locator('#interaction-panel');
        const acceptedQuests = page.locator('#accepted-quests-container');

        await expect(interactionPanel).toBeHidden();
        await expect(page.locator('.available-quests-widget')).toHaveCount(0);
        await expect(acceptedQuests).not.toContainText('Available Quests');
        await expect(acceptedQuests).not.toContainText('Herb Gatherer');

        await clickNPC(page, 'villager');
        await expect(interactionPanel).toBeVisible();
        await expect(page.locator('.available-quests-widget')).toHaveCount(0);

        await clickNPC(page, 'king');
        await expect(page.locator('.available-quests-widget')).toBeVisible();
        await expect(page.locator('#interaction-content')).toContainText('Herb Gatherer');
    });

    test('accepts a quest and shows it in the quest log', async ({ page }) => {
        await clickNPC(page, 'king');
        await page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]').click();

        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');
        await expect(
            page.locator('#accepted-quests-container .quest-drop-btn[data-quest-id="quest_herb_gatherer"]')
        ).toBeVisible();
        await expect(page.locator('#interaction-content')).not.toContainText('Herb Gatherer');
    });

    test('persists quest acceptance and dropping across saves', async ({ page }) => {
        await clickNPC(page, 'king');
        await page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]').click();
        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');
        expect(await page.evaluate(() => Game.saveGame(1))).toBe(true);

        expect(await page.evaluate(() => Game.loadGame(1))).toBe(true);
        await expect(page.locator('#interaction-panel')).toBeHidden();
        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');

        await page.locator(
            '#accepted-quests-container .quest-drop-btn[data-quest-id="quest_herb_gatherer"]'
        ).click();
        await expect(page.locator('#accepted-quests-container')).not.toContainText('Herb Gatherer');
        expect(await page.evaluate(() => Game.loadGame(1))).toBe(true);

        const wasDropped = await page.evaluate(() =>
            QuestSystem.activeQuests.find(quest => quest.id === 'quest_herb_gatherer').state.dropped
        );
        expect(wasDropped).toBe(true);

        await clickNPC(page, 'king');
        await expect(page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]')).toBeVisible();
    });
});
