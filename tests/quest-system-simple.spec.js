const { test, expect } = require('@playwright/test');

async function startNewAdventure(page) {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('file:///home/chris/code/html_rpg_game/index.html');
    await page.locator('#new-adventure').click();
    await page.locator('#hero-name').fill('TestHero');
    await page.locator('#character-next').click();
    await page.locator('#character-next').click();
    await page.locator('#character-submit').click();
    await expect(page.locator('#character-creation')).toBeHidden();
}

async function clickNPC(page, type) {
    const position = await page.evaluate(npcType => {
        const npc = Game.npcs.find(candidate => candidate.type === npcType && candidate.alive);
        if (!npc) throw new Error(`No living ${npcType} NPC found`);
        Game.player.x = npc.x;
        Game.player.y = npc.y;
        Game.updateCamera();
        Game.render();
        const bounds = Game.canvas.getBoundingClientRect();
        return {
            x: (npc.x - Game.cameraX + 0.5) * bounds.width / Game.viewWidth,
            y: (npc.y - Game.cameraY + 0.5) * bounds.height / Game.viewHeight
        };
    }, type);
    await page.locator('#gameCanvas').click({ position });
}

test.describe('Quest System', () => {
    test.beforeEach(async ({ page }) => {
        await startNewAdventure(page);
    });

    test('available quests stay hidden until the player clicks the quest giver', async ({ page }) => {
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
        await expect(page.locator('#interaction-content')).toContainText('Available Quests');
        await expect(page.locator('#interaction-content')).toContainText('Herb Gatherer');
    });

    test('accepting a quest adds it to the accepted quests widget', async ({ page }) => {
        await clickNPC(page, 'king');
        await page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]').click();

        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');
        await expect(page.locator('#accepted-quests-container .quest-drop-btn[data-quest-id="quest_herb_gatherer"]'))
            .toBeVisible();
        await expect(page.locator('#interaction-content')).not.toContainText('Herb Gatherer');
    });

    test('accepted and dropped quests persist when saving and loading', async ({ page }) => {
        await clickNPC(page, 'king');
        await page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]').click();
        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');
        expect(await page.evaluate(() => Game.saveGame(1))).toBe(true);

        expect(await page.evaluate(() => Game.loadGame(1))).toBe(true);
        await expect(page.locator('#interaction-panel')).toBeHidden();
        await expect(page.locator('#accepted-quests-container')).toContainText('Herb Gatherer');

        await page.locator('#accepted-quests-container .quest-drop-btn[data-quest-id="quest_herb_gatherer"]').click();
        await expect(page.locator('#accepted-quests-container')).not.toContainText('Herb Gatherer');
        expect(await page.evaluate(() => Game.loadGame(1))).toBe(true);
        const dropped = await page.evaluate(() =>
            QuestSystem.activeQuests.find(quest => quest.id === 'quest_herb_gatherer').state.dropped
        );
        expect(dropped).toBe(true);

        await clickNPC(page, 'king');
        await expect(page.locator('.quest-accept-btn[data-quest-id="quest_herb_gatherer"]')).toBeVisible();
    });
});
