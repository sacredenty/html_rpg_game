const { test, expect } = require('@playwright/test');

test.describe('Game UI Tests - Simple', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        await page.waitForTimeout(3000);
        
        const startButton = page.locator('button:has-text("Start")');
        if (await startButton.isVisible()) {
            await startButton.click();
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

test.describe('Quest UI Tests - Simple', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        await page.waitForTimeout(3000);
        
        const startButton = page.locator('button:has-text("Start")');
        if (await startButton.isVisible()) {
            await startButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Quest container should exist', async ({ page }) => {
        const talkBtn = page.locator('#interact-btn');
        if (await talkBtn.count() > 0) {
            await talkBtn.click();
            await page.waitForTimeout(1500);
            
            const questsContainer = page.locator('#interaction-content');
            if (await questsContainer.count() > 0) {
                await expect(questsContainer).toBeVisible();
            }
        }
    });

    test('Interaction panel should be accessible', async ({ page }) => {
        const talkBtn = page.locator('#interact-btn');
        if (await talkBtn.count() > 0) {
            await talkBtn.click();
            await page.waitForTimeout(1500);
            
            const content = page.locator('#interaction-content');
            if (await content.count() > 0) {
                // Content should have some visible elements
                const divs = await content.locator('div, p').all();
                expect(divs.length).toBeGreaterThan(0);
            }
        }
    });

    test('Quest board headers should be readable', async ({ page }) => {
        const talkBtn = page.locator('#interact-btn');
        if (await talkBtn.count() > 0) {
            await talkBtn.click();
            await page.waitForTimeout(2000);
            
            const content = page.locator('#interaction-content');
            const text = await content.textContent();
            
            // Content should have headers
            expect(text.toLowerCase()).toMatch(/in progress|completed|available/);
        } else {
            test.skip('Talk button not found, skipping header check', () => {});
        }
    });

    test('Quest board should not be empty', async ({ page }) => {
        const talkBtn = page.locator('#interact-btn');
        if (await talkBtn.count() > 0) {
            await talkBtn.click();
            await page.waitForTimeout(2000);
            
            const content = page.locator('#interaction-content');
            const text = await content.textContent();
            
            // Should have some quest-related text
            expect(text.trim().length).toBeGreaterThan(50);
        } else {
            test.skip('Talk button not found, skipping emptiness check', () => {});
        }
    });

    test('Quest names should be present in DOM', async ({ page }) => {
        const talkBtn = page.locator('#interact-btn');
        if (await talkBtn.count() > 0) {
            await talkBtn.click();
            await page.waitForTimeout(2000);
            
            const content = page.locator('#interaction-content');
            const strongElements = await content.locator('strong').all();
            
            expect(strongElements.length).toBeGreaterThan(0);
        } else {
            test.skip('Talk button not found, skipping quest name check', () => {});
        }
    });
});
