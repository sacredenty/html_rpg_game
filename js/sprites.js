// Original pixel-art renderer for the overworld and its characters.
const SpriteRenderer = {
    palettes: {
        hero: {
            k: '#20243a', h: '#a95843', H: '#edba91', b: '#284b91',
            B: '#527ed0', r: '#963e4c', R: '#d56a65', y: '#f4ca68', Y: '#f4ca68',
            w: '#f2e8cf', s: '#3c4057'
        },
        mage: {
            k: '#20243a', h: '#a95843', H: '#edba91', m: '#553779',
            M: '#8860b5', p: '#352b53', P: '#6c4a9b', r: '#963e4c',
            y: '#f4ca68', Y: '#f4ca68', w: '#f2e8cf'
        },
        ranger: {
            k: '#20243a', h: '#a95843', H: '#edba91', b: '#31533e',
            B: '#5f8b54', r: '#80513e', R: '#bf8650', y: '#f4ca68',
            Y: '#f4ca68', w: '#f2e8cf', s: '#3c4057'
        },
        king: {
            k: '#20243a', h: '#a95843', H: '#edba91', b: '#284b91',
            B: '#527ed0', r: '#963e4c', R: '#d56a65', y: '#f4ca68', Y: '#f4ca68',
            w: '#f2e8cf', s: '#3c4057'
        },
        merchant: {
            k: '#20243a', h: '#a95843', H: '#edba91', b: '#276552',
            B: '#5b9b70', r: '#80513e', R: '#bf8650', y: '#f4ca68', Y: '#f4ca68',
            w: '#f2e8cf', s: '#3c4057'
        },
        villager: {
            k: '#20243a', h: '#a95843', H: '#edba91', b: '#80513e',
            B: '#bf8650', r: '#5a6683', R: '#8b9ab2', y: '#f4ca68', Y: '#f4ca68',
            w: '#f2e8cf', s: '#3c4057'
        },
        slime: { k: '#173b36', g: '#27815b', G: '#58bd78', L: '#a6e69a', w: '#e7f8d0' },
        wolf: { k: '#30364b', g: '#667187', G: '#aab5c5', L: '#dce3e6', r: '#a95859', y: '#f4ca68' },
        skeleton: { k: '#30364b', b: '#68758a', w: '#e8e2ce', W: '#fff5d9', s: '#a5a28e', y: '#f4ca68', Y: '#f4ca68' },
        goblin: { k: '#263b2b', g: '#538444', G: '#8eb65d', h: '#a95843', H: '#edba91', b: '#554e83', B: '#8178ad', r: '#963e4c', y: '#f4ca68', w: '#f2e8cf', s: '#3c4057' },
        orc: { k: '#342b35', g: '#7e4540', G: '#b86a52', h: '#a95843', H: '#edba91', b: '#554e83', B: '#8178ad', r: '#553746', R: '#9c5360', y: '#f4ca68', w: '#f2e8cf', s: '#3c4057' },
        dragon: { k: '#302443', p: '#603d82', P: '#9565b4', L: '#c59bd1', r: '#a94c59', y: '#f4ca68', w: '#f2e8cf' }
    },

    patterns: {
        hero: [
            '....kkkk....',
            '...khhhhkk..',
            '..khHHHHHk..',
            '..khHhHHHk..',
            '...kHHHHkk..',
            '....krrk....',
            '...kbbbbk...',
            '..kBbbbbBk..',
            '..kbbbbbbk..',
            '..kbbYbbbk..',
            '...krrrrk...',
            '...ks..sk...',
            '...ks..sk...',
            '..kk....kk..',
            '..kk....kk..',
            '..ww....ww..'
        ],
        mage: [
            '......Y.....',
            '.....YyY....',
            '....YyyyY...',
            '...kYYYYYk..',
            '..kpppppppk.',
            '..kphHHHppk.',
            '..kpHhHpppk.',
            '...kppppk....',
            '....krrk....',
            '...kmmmmk...',
            '..kMmmmmMk..',
            '..kmmmmmmk..',
            '..kmmYmmmk..',
            '...krrrrk...',
            '..kk....kk..',
            '..ww....ww..'
        ],
        ranger: [
            '....kkkk....',
            '...kBBBBk...',
            '..kBBBBBBk..',
            '..khhhhkk...',
            '..khHHHHk...',
            '..khHhHHk...',
            '...kHHHkk...',
            '....krrk....',
            '...kbbbbk...',
            '..kBbbbbBk..',
            '..kbbbbbbk..',
            '..kbbYbbbk..',
            '...krrrrk...',
            '..kk....kk..',
            '..kk....kk..',
            '..ww....ww..'
        ],
        king: [
            '..y..y..y..',
            '..yyyyyyyy..',
            '...kkkkkk...',
            '..khhhhkk...',
            '..khHHHHk...',
            '..khHhHHk...',
            '...kHHHkk...',
            '....krrk....',
            '...kbbbbk...',
            '..kBbbbbBk..',
            '..kbbbbbbk..',
            '..kbbYbbbk..',
            '...krrrrk...',
            '..kk....kk..',
            '..kk....kk..',
            '..ww....ww..'
        ],
        merchant: [
            '....rrrr....',
            '...rRRRRr...',
            '..rrrrrrrr..',
            '...kkkkkk...',
            '..khhhhkk...',
            '..khHHHHk...',
            '..khHhHHk...',
            '...kHHHkk...',
            '....krrk....',
            '...kbbbbk...',
            '..kBbbbbBk..',
            '..kbbbbbbk..',
            '..kbbYbbbk..',
            '...krrrrk...',
            '..kk....kk..',
            '..ww....ww..'
        ],
        villager: [
            '....kkkk....',
            '...ksssskk..',
            '..khhhhkk...',
            '..khHHHHk...',
            '..khHhHHk...',
            '...kHHHkk...',
            '....krrk....',
            '...kbbbbk...',
            '..kBbbbbBk..',
            '..kbbbbbbk..',
            '..kbbYbbbk..',
            '...krrrrk...',
            '..kk....kk..',
            '..kk....kk..',
            '..ww....ww..'
        ],
        slime: [
            '....kkkk....',
            '..kkGGGGkk..',
            '.kGGGGGGGGk.',
            'kGGGGGGGGGGk',
            'kGGLGGGGGGLk',
            'kGGGGGGGGGGk',
            'kGGGGGGGGGGk',
            'kGGGkkkkGGGk',
            '.kkkk..kkkk.'
        ],
        wolf: [
            '...kk....kk...',
            '..kGk....kGk..',
            '..kGGkkkkGGk..',
            '...kGGGGGGk...',
            '..kGGGGGGGGk..',
            '.kGGGkGGkGGGk.',
            'kGGGGGGGGGGGGk',
            'kGGGkGGGGkGGGk',
            '.kGGGGGGGGGGk.',
            '..kGGGGGGGGk..',
            '...kGGkkGGk...',
            '..kkk....kkk..'
        ],
        skeleton: [
            '....kkkk....',
            '...kWWWWk...',
            '..kWwWWwWk..',
            '..kWWWWWWk..',
            '..kWkWWkWk..',
            '...kWWWWk...',
            '....kssk....',
            '...kwwwwk...',
            '..kwWwwWwk..',
            '..kwwwwwwk..',
            '...kwYYwk...',
            '..kk....kk..',
            '..ks....sk..',
            '..ks....sk..',
            '..kk....kk..',
            '..ww....ww..'
        ],
        goblin: [
            '...kk....kk...',
            '..kGGk..kGGk..',
            '..kGGGkkGGGk..',
            '...kGGGGGGk...',
            '..khHHHHHHhk..',
            '..khHkHHkHhk..',
            '...kHHHHHHk...',
            '....krrrrk....',
            '...kbbbbbbk...',
            '..kBbbbbbbBk..',
            '..kbbbbbbbbk..',
            '...krrrrrrk...',
            '..kk......kk..',
            '..ww......ww..'
        ],
        orc: [
            '..kk......kk..',
            '.kGGk....kGGk.',
            '..kGGkkkkGGk..',
            '...kGGGGGGk...',
            '..khHHHHHHhk..',
            '..khHkHHkHhk..',
            '...kHHHHHHk...',
            '..krrrrrrrrk..',
            '.kRrrrrrrrrRk.',
            '..kbbbbbbbbk..',
            '.kBbbbbbbbbBk.',
            '..kbbbbbbbbk..',
            '...krrrrrrk...',
            '..kk......kk..',
            '..ww......ww..'
        ],
        dragon: [
            'k..k......k..k',
            'kk.kP....Pk.kk',
            '.kkkPP..PPkkk.',
            '...kPPPPPPk...',
            '....kPPPPk....',
            '...kPPPPPPk...',
            '..kPPkPPkPPk..',
            '.kPPP kkk PPPk.',
            'kPPPPPPPPPPPPk',
            '.kPPPkPPkPPPk.',
            '..kPPPPPPPPk..',
            '...kPPPPPPk...',
            '....kPPPPk....',
            '...kk....kk...',
            '..kk......kk..',
            '..ww......ww..'
        ]
    },

    drawPixelSprite(game, pattern, palette, worldX, worldY, scale = 1) {
        const ctx = game.ctx;
        const rows = pattern.map(row => row.replaceAll(' ', ''));
        const width = Math.max(...rows.map(row => row.length));
        const pixel = game.TILE_SIZE / 16 * scale;
        const left = (worldX + 0.5) * game.TILE_SIZE - width * pixel / 2;
        const top = (worldY + 1) * game.TILE_SIZE - rows.length * pixel;

        rows.forEach((row, rowIndex) => {
            const rowLeft = left + (width - row.length) * pixel / 2;
            [...row].forEach((colorKey, columnIndex) => {
                if (colorKey === '.') return;
                ctx.fillStyle = palette[colorKey];
                ctx.fillRect(
                    Math.round(rowLeft + columnIndex * pixel),
                    Math.round(top + rowIndex * pixel),
                    Math.ceil(pixel),
                    Math.ceil(pixel)
                );
            });
        });
    },

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
};
