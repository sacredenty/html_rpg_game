// Base
Object.assign(SpriteRenderer, {
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
});
