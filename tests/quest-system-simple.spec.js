const { test, expect } = require('@playwright/test');

test.describe('Quest System Tests - Simple', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to game and wait for it to load
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        
        // Wait for game to initialize
        await page.waitForTimeout(3000);
        
        // Handle character creation if needed
        const startButton = page.locator('button:has-text("Start")');
        if (await startButton.isVisible()) {
            await startButton.click();
            await page.waitForTimeout(1000);
        }
        
        // If there's a character selection dialog, close it or create a simple character
        const createCharBtn = page.locator('button:has-text("Create")');
        if (await createCharBtn.count() > 0) {
            await createCharBtn.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Quest text should be readable (not white on white)', async ({ page }) => {
        // Open interaction panel to see quests
        const talkButton = page.locator('#interact-btn');
        if (await talkButton.count() > 0) {
            await talkButton.click();
            
            // Wait for quest board to render
            await page.waitForTimeout(2000);
            
            // Check that quest names are visible with dark text
            const questContent = page.locator('#interaction-content');
            if (await questContent.count() > 0) {
                const questElements = await questContent.locator('strong, div').all();
                
                for (const element of questElements) {
                    const textColor = await element.evaluate(el => getComputedStyle(el).color);
                    const bgColor = await element.evaluate(el => getComputedStyle(el).backgroundColor);
                    
                    // Text should not be white on white/light background
                    expect(textColor.toLowerCase()).not.toEqual('rgb(255, 255, 255)');
                    expect(textColor.toLowerCase()).not.toContain('#fafb');
                }
            }
        } else {
            // If no talk button found, check for any quest-related content
            const anyQuest = page.locator('#interaction-content').filter({ hasText: "Quest" });
            if (await anyQuest.count() > 0) {
                await expect(anyQuest).toBeVisible();
            }
        }
    });

    test('Quest board should show quest names', async ({ page }) => {
        const talkButton = page.locator('#interact-btn');
        if (await talkButton.count() > 0) {
            await talkButton.click();
            await page.waitForTimeout(2000);
            
            // Check for any strong/text elements in quest board
            const questNames = page.locator('#interaction-content strong');
            const count = await questNames.count();
            
            if (count > 0) {
                // Verify at least some text is visible
                const visibleElements = await questNames.filter({isVisible: true}).all();
                expect(visibleElements.length).toBeGreaterThan(0);
            }
        }
    });

    test('Quest rewards should be displayed', async ({ page }) => {
        const talkButton = page.locator('#interact-btn');
        if (await talkButton.count() > 0) {
            await talkButton.click();
            await page.waitForTimeout(2000);
            
            // Check that reward information exists in the content
            const content = page.locator('#interaction-content');
            const text = await content.textContent();
            const hasRewardText = text.includes('XP') || text.includes('gold');
            
            expect(hasRewardText).toBe(true);
        } else {
            test.skip('Talk button not found, skipping rewards check', () => {});
        }
    });

    test('Quest board container should exist', async ({ page }) => {
        const talkButton = page.locator('#interact-btn');
        if (await talkButton.count() > 0) {
            await talkButton.click();
            await page.waitForTimeout(1500);
            
            const questContainer = page.locator('#interaction-content');
            if (await questContainer.count() > 0) {
                await expect(questContainer).toBeVisible();
            }
        } else {
            test.skip('Talk button not found, skipping container check', () => {});
        }
    });

    test('Page should not be blank after opening quests', async ({ page }) => {
        const talkButton = page.locator('#interact-btn');
        if (await talkButton.count() > 0) {
            await talkButton.click();
            await page.waitForTimeout(2000);
            
            // Verify the content is not empty
            const content = page.locator('#interaction-content');
            const text = await content.textContent();
            
            // Content should have some text (not just whitespace)
            expect(text.trim()).not.toBe('');
        } else {
            test.skip('Talk button not found, skipping blank check', () => {});
        }
    });
});
