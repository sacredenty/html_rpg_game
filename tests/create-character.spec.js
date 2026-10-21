const { test, expect } = require('@playwright/test');

test.describe('Character creation', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
        await page.goto('index.html');
    });

    test('opens from the startup menu and requires a hero name', async ({ page }) => {
        await expect(page.locator('#startup-menu')).toBeVisible();
        await page.locator('#new-adventure').click();
        await expect(page.locator('#character-creation')).toBeVisible();

        await page.locator('#character-next').click();

        await expect(page.locator('#creation-progress')).toHaveText('Step 1 of 3: Identity');
        await expect(page.locator('#hero-name')).toHaveJSProperty(
            'validationMessage',
            'Enter a name for your hero.'
        );
    });

    test('creates the selected hero and starts the adventure', async ({ page }) => {
        await page.locator('#new-adventure').click();
        await page.locator('#hero-name').fill('Test Mage');
        await page.locator('#character-next').click();
        await expect(page.locator('#creation-progress')).toHaveText('Step 2 of 3: Class');

        await page.locator('input[name="hero-class"][value="mage"]').check();
        await page.locator('input[name="difficulty"][value="hard"]').check();
        await page.locator('#character-next').click();
        await expect(page.locator('#review-hero-name')).toHaveText('Test Mage');
        await expect(page.locator('#review-hero-class')).toHaveText('Mage');
        await expect(page.locator('#review-difficulty')).toContainText('Hard');

        await page.locator('#character-submit').click();

        await expect(page.locator('#character-creation')).toBeHidden();
        await expect(page.locator('#player-name')).toHaveText('Test Mage · Mage');
        await expect(page.locator('#difficulty-display')).toHaveText('Hard');
        await expect(page.locator('#spell-select')).toBeEnabled();
        await expect(page.locator('#spell-select option')).not.toHaveCount(0);
    });

    test('scales monster damage and gold and restores difficulty from a save', async ({ page }) => {
        await page.locator('#new-adventure').click();
        await page.locator('#hero-name').fill('TestHero');
        await page.locator('#character-next').click();
        await page.locator('input[name="difficulty"][value="hard"]').check();
        await page.locator('#character-next').click();
        await page.locator('#character-submit').click();
        await expect(page.locator('#difficulty-display')).toHaveText('Hard');

        const scaledRewards = await page.evaluate(() => {
            const originalRandom = Utils.random;
            Utils.random = () => 20;
            Game.player.stats.endurance = 0;
            const monster = { attack: 20, gold: 20 };
            const results = {};
            try {
                for (const difficulty of ['easy', 'medium', 'hard']) {
                    Game.difficulty = difficulty;
                    results[difficulty] = {
                        damage: Game.calculateMonsterDamage(monster),
                        gold: Game.calculateMonsterGold(monster)
                    };
                }
            } finally {
                Utils.random = originalRandom;
            }
            return results;
        });

        expect(scaledRewards).toEqual({
            easy: { damage: 16, gold: 25 },
            medium: { damage: 24, gold: 20 },
            hard: { damage: 36, gold: 30 }
        });

        expect(await page.evaluate(() => Game.saveGame(1))).toBe(true);
        await page.evaluate(() => {
            Game.difficulty = 'easy';
            Game.updateDifficultyDisplay();
        });
        expect(await page.evaluate(() => Game.loadGame(1))).toBe(true);
        await expect(page.locator('#difficulty-display')).toHaveText('Hard');
    });
});
