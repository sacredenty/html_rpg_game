// Characters
Object.assign(SpriteRenderer, {
    drawHero(game) {
        const ctx = game.ctx;
        const tileSize = game.TILE_SIZE;
        const tileX = game.player.x * tileSize;
        const tileY = game.player.y * tileSize;
        const classId = this.palettes[game.player.classId] ? game.player.classId : 'hero';

        ctx.fillStyle = 'rgba(250, 204, 21, 0.14)';
        ctx.fillRect(tileX + 2, tileY + 2, tileSize - 4, tileSize - 4);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#172033';
        ctx.strokeRect(tileX + 2, tileY + 2, tileSize - 4, tileSize - 4);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#facc15';
        ctx.strokeRect(tileX + 2, tileY + 2, tileSize - 4, tileSize - 4);

        this.drawHeroAppearance(game, classId, game.player.x, game.player.y);

        const centerX = (game.player.x + 0.5) * tileSize;
        const markerY = tileY - 14;
        ctx.beginPath();
        ctx.moveTo(centerX, markerY + 12);
        ctx.lineTo(centerX - 9, markerY);
        ctx.lineTo(centerX + 9, markerY);
        ctx.closePath();
        ctx.lineJoin = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#172033';
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.fill();
    },

    drawHeroAppearance(game, classId, worldX, worldY) {
        const ctx = game.ctx;
        const tileSize = game.TILE_SIZE;
        const palette = this.palettes[classId] || this.palettes.hero;
        const pattern = this.patterns[classId] || this.patterns.hero;
        this.drawPixelSprite(game, pattern, palette, worldX, worldY);

        const centerX = (worldX + 0.5) * tileSize;
        const topY = worldY * tileSize;
        const pixel = tileSize / 16;
        if (classId === 'mage') {
            ctx.strokeStyle = '#8b5e3c';
            ctx.lineWidth = Math.max(2, pixel);
            ctx.beginPath();
            ctx.moveTo(centerX + 13, topY + 34);
            ctx.lineTo(centerX + 13, topY + 11);
            ctx.stroke();
            ctx.fillStyle = '#c4b5fd';
            ctx.beginPath();
            ctx.arc(centerX + 13, topY + 9, pixel * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.arc(centerX + 13, topY + 9, pixel * 0.6, 0, Math.PI * 2);
            ctx.fill();
        } else if (classId === 'ranger') {
            ctx.strokeStyle = '#8b5e3c';
            ctx.lineWidth = Math.max(2, pixel);
            ctx.beginPath();
            ctx.moveTo(centerX + 9, topY + 11);
            ctx.quadraticCurveTo(centerX + 23, topY + 22, centerX + 9, topY + 34);
            ctx.stroke();
            ctx.strokeStyle = '#e7d9b8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX + 9, topY + 11);
            ctx.lineTo(centerX + 9, topY + 34);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#e8e6d4';
            ctx.fillRect(centerX + 10, topY + 20, pixel * 2, pixel * 7);
            ctx.fillStyle = '#f4ca68';
            ctx.fillRect(centerX + 9, topY + 25, pixel * 4, pixel * 2);
        }
    },

    drawMonster(game, monster) {
        const pattern = this.patterns[monster.type] || this.patterns.goblin;
        const palette = this.palettes[monster.type] || this.palettes.goblin;
        this.drawPixelSprite(game, pattern, palette, monster.x, monster.y, Math.min(monster.size || 1, 1.35));
    },

    drawNPC(game, npc) {
        const type = this.patterns[npc.type] ? npc.type : 'villager';
        this.drawPixelSprite(game, this.patterns[type], this.palettes[type], npc.x, npc.y);
    },
});
