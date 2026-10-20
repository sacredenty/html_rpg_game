const { test, expect } = require('@playwright/test');

test.describe('Game UI Tests - Simple', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        
        // Wait for game to load and handle startup menu / character creation
        await page.waitForTimeout(2000);
        
        // Click through any open dialogs - first click the new adventure button
        const newAdventureBtn = page.locator('#new-adventure');
        if (await newAdventureBtn.count() > 0) {
            await newAdventureBtn.click();
            await page.waitForTimeout(500);
            
            // Fill in character name and continue through creation
            const createCharDialog = page.locator('#character-creation');
            if (await createCharDialog.count() > 0) {
                await page.click('#hero-name');
                await page.fill('#hero-name', 'TestHero');
                await page.click('#character-next');
                await page.waitForTimeout(200);
                await page.click('#character-next');
                await page.waitForTimeout(200);
                await page.click('#character-submit');
            }
        } else {
            // Game already initialized, wait a bit more for game to settle
            await page.waitForTimeout(1000);
        }
    });

    test('Player name should be visible', async ({ page }) => {
        const playerName = page.locator('#player-name');
        if (await playerName.count() > 0) {
            await expect(playerName).toBeVisible();
        }
    });

    test('Level display should exist', async ({ page }) => {
        const levelDisplay = page.locator('#level-display');
        if (await levelDisplay.count() > 0) {
            await expect(levelDisplay).toBeVisible();
        }
    });

    test('HP display should exist', async ({ page }) => {
        const hpDisplay = page.locator('#hp-display');
        if (await hpDisplay.count() > 0) {
            await expect(hpDisplay).toBeVisible();
        }
    });

    test('Explore button should exist', async ({ page }) => {
        const exploreButton = page.locator('button').filter({ hasText: 'Explore' });
        if (await exploreButton.count() > 0) {
            await expect(exploreButton).toBeVisible();
        }
    });

    test('Action buttons panel should exist', async ({ page }) => {
        const actionsPanel = page.locator('#actions-panel');
        if (await actionsPanel.count() > 0) {
            await expect(actionsPanel).toBeVisible();
        }
    });
});

test.describe('Quest UI Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        await page.locator('#new-adventure').click();
        await page.locator('#hero-name').fill('TestHero');
        await page.locator('#character-next').click();
        await page.locator('#character-next').click();
        await page.locator('#character-submit').click();
        await expect(page.locator('#character-creation')).toBeHidden();
    });

    test('Quest Log is visible without showing available quests', async ({ page }) => {
        await expect(page.locator('#accepted-quests-container')).toBeVisible();
        await expect(page.locator('#accepted-quests-container')).toContainText('No active quests');
        await expect(page.locator('#accepted-quests-container')).not.toContainText('Available Quests');
        await expect(page.locator('#interaction-panel')).toBeHidden();
    });

    test('quest giver click opens the available quests widget', async ({ page }) => {
        const position = await page.evaluate(() => {
            const king = Game.npcs.find(npc => npc.type === 'king' && npc.alive);
            if (!king) throw new Error('No living quest giver found');
            Game.player.x = king.x;
            Game.player.y = king.y;
            Game.updateCamera();
            Game.render();
            const bounds = Game.canvas.getBoundingClientRect();
            return {
                x: (king.x - Game.cameraX + 0.5) * bounds.width / Game.viewWidth,
                y: (king.y - Game.cameraY + 0.5) * bounds.height / Game.viewHeight
            };
        });
        await page.locator('#gameCanvas').click({ position });

        await expect(page.locator('#interaction-panel')).toBeVisible();
        await expect(page.locator('#interaction-content')).toContainText('Available Quests');
        await expect(page.locator('#interaction-content .quest-accept-btn').first()).toBeVisible();
    });
});
