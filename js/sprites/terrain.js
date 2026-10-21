// Terrain
Object.assign(SpriteRenderer, {
    drawGrassTile(game, x, y) {
        const ctx = game.ctx;
        const tileSize = game.TILE_SIZE;
        const seed = Math.abs(Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263));
        const shades = ['#397447', '#3e7b49', '#427d49', '#3b7544'];
        ctx.fillStyle = shades[seed % shades.length];
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

        for (let detail = 0; detail < 3; detail++) {
            const detailSeed = Math.abs(Math.imul(seed + detail * 31, 1274126177));
            const px = x * tileSize + (detailSeed % 8) * 4 + 2;
            const py = y * tileSize + (Math.floor(detailSeed / 13) % 8) * 4 + 2;
            ctx.fillStyle = detail % 2 ? '#4a8a4d' : '#326840';
            ctx.fillRect(px, py, 4, 2);
        }
    },

    drawTerrain(game) {
        const ctx = game.ctx;
        const tileSize = game.TILE_SIZE;
        for (let screenY = 0; screenY < game.viewHeight; screenY++) {
            for (let screenX = 0; screenX < game.viewWidth; screenX++) {
                const x = game.cameraX + screenX;
                const y = game.cameraY + screenY;
                const type = game.map[y]?.[x]?.type;
                const left = x * tileSize;
                const top = y * tileSize;
                this.drawGrassTile(game, x, y);

                if (type === 'river' || type === 'lake') {
                    ctx.fillStyle = type === 'lake' ? '#246b96' : '#2877a1';
                    ctx.fillRect(left, top, tileSize, tileSize);
                    ctx.fillStyle = '#55a8bd';
                    ctx.fillRect(left + 6, top + 8, 10, 3);
                    ctx.fillRect(left + 24, top + 21, 9, 3);
                    ctx.fillStyle = '#194f78';
                    ctx.fillRect(left + 19, top + 13, 8, 2);
                } else if (type === 'bridge') {
                    ctx.fillStyle = '#70432f';
                    ctx.fillRect(left, top, tileSize, tileSize);
                    ctx.fillStyle = '#c08a4c';
                    ctx.fillRect(left + 2, top + 3, tileSize - 4, 5);
                    ctx.fillRect(left + 2, top + 16, tileSize - 4, 5);
                    ctx.fillRect(left + 2, top + 29, tileSize - 4, 5);
                    ctx.fillStyle = '#51392f';
                    ctx.fillRect(left + 7, top + 3, 2, 31);
                    ctx.fillRect(left + 30, top + 3, 2, 31);
                } else if (type === 'mountain') {
                    ctx.fillStyle = '#38445a';
                    ctx.fillRect(left, top, tileSize, tileSize);
                    ctx.fillStyle = '#65758a';
                    ctx.fillRect(left + 6, top + 21, 28, 15);
                    ctx.fillRect(left + 11, top + 13, 19, 10);
                    ctx.fillStyle = '#9aa7aa';
                    ctx.fillRect(left + 17, top + 5, 6, 10);
                    ctx.fillStyle = '#d8dfd2';
                    ctx.fillRect(left + 17, top + 5, 6, 3);
                    ctx.fillRect(left + 13, top + 13, 5, 3);
                    ctx.fillStyle = '#293448';
                    ctx.fillRect(left + 4, top + 35, 32, 3);
                } else if (type === 'town' || type === 'road') {
                    ctx.fillStyle = type === 'road' ? '#98734a' : '#52774b';
                    ctx.fillRect(left, top, tileSize, tileSize);
                    if (type === 'road') {
                        ctx.fillStyle = '#b18c5b';
                        ctx.fillRect(left + 3, top + 4, 34, 31);
                        ctx.fillStyle = '#8e6947';
                        ctx.fillRect(left + 6, top + 8, 5, 3);
                        ctx.fillRect(left + 26, top + 25, 6, 3);
                    }
                } else if (type === 'house') {
                    ctx.fillStyle = '#443a43';
                    ctx.fillRect(left + 4, top + 15, 32, 22);
                    ctx.fillStyle = '#bd594b';
                    ctx.fillRect(left + 2, top + 10, 36, 7);
                    ctx.fillRect(left + 7, top + 5, 26, 7);
                    ctx.fillRect(left + 12, top + 1, 16, 6);
                    ctx.fillStyle = '#e3b467';
                    ctx.fillRect(left + 8, top + 20, 7, 7);
                    ctx.fillRect(left + 25, top + 20, 7, 7);
                    ctx.fillStyle = '#292e3c';
                    ctx.fillRect(left + 18, top + 25, 6, 12);
                    ctx.fillStyle = '#f5d890';
                    ctx.fillRect(left + 20, top + 29, 2, 2);
                }
            }
        }
    },
});
