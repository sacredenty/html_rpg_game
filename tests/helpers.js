const { expect } = require('@playwright/test');

async function startNewAdventure(page, {
    name = 'TestHero',
    classId = 'warrior',
    difficulty = 'medium'
} = {}) {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('index.html');
    await page.locator('#new-adventure').click();
    await page.locator('#hero-name').fill(name);
    await page.locator('#character-next').click();
    await page.locator(`input[name="hero-class"][value="${classId}"]`).check();
    await page.locator(`input[name="difficulty"][value="${difficulty}"]`).check();
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

module.exports = { clickNPC, startNewAdventure };
