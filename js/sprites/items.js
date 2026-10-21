// Items
Object.assign(SpriteRenderer, {
    drawItem(game, item) {
        const ctx = game.ctx;
        const x = item.x * game.TILE_SIZE;
        const y = item.y * game.TILE_SIZE;
        const colors = {
            healthPotion: ['#6f263b', '#d6555d', '#f2a16e'],
            manaPotion: ['#423779', '#8063bd', '#c3a6e8'],
            healingHerb: ['#276147', '#56a75e', '#acd279'],
            sword: ['#48556a', '#c5d0d5', '#f4ca68'],
            legendarySword: ['#523f76', '#f4ca68', '#fff2b3']
        }[item.type] || ['#46556b', item.color || '#b8c3d0', '#f0e3b1'];
        const pixel = game.TILE_SIZE / 16;
        ctx.fillStyle = 'rgba(24, 31, 45, 0.35)';
        ctx.fillRect(x + 12, y + 31, 17, 4);
        if (item.type === 'healingHerb') {
            ctx.fillStyle = colors[0];
            ctx.fillRect(x + 19, y + 19, 3, 13);
            ctx.fillStyle = colors[1];
            ctx.fillRect(x + 10, y + 13, 10, 5);
            ctx.fillRect(x + 22, y + 9, 9, 5);
            ctx.fillStyle = colors[2];
            ctx.fillRect(x + 13, y + 14, 4, 2);
            ctx.fillRect(x + 25, y + 10, 4, 2);
        } else if (item.type.includes('sword')) {
            ctx.fillStyle = colors[0];
            ctx.fillRect(x + 18, y + 25, 5, 9);
            ctx.fillRect(x + 14, y + 27, 13, 3);
            ctx.fillStyle = colors[1];
            ctx.fillRect(x + 19, y + 7, 3, 19);
            ctx.fillRect(x + 16, y + 11, 3, 4);
            ctx.fillStyle = colors[2];
            ctx.fillRect(x + 20, y + 7, 2, 13);
        } else {
            ctx.fillStyle = colors[0];
            ctx.fillRect(x + 12, y + 13, 16, 17);
            ctx.fillRect(x + 15, y + 9, 10, 5);
            ctx.fillStyle = colors[1];
            ctx.fillRect(x + 14, y + 16, 12, 11);
            ctx.fillStyle = colors[2];
            ctx.fillRect(x + 16, y + 16, 4, 4);
            ctx.fillRect(x + 11, y + 29, 18, 3);
        }
        ctx.fillStyle = '#fff4c2';
        ctx.fillRect(x + 6, y + 8, pixel, pixel);
    }
});
