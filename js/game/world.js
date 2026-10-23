// World game behavior
Object.assign(Game, {
    generateWorld() {
        // Create empty map
        this.map = Array(this.height).fill().map(() => Array(this.width).fill(null));
        this.generateTerrain();
        
        // Generate terrain
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const rand = Math.random();
                
                if (rand < 0.1) {
                    if (Math.random() < 0.05) {
                        this.spawnItem('healthPotion', x, y);
                    }
                } else if (rand < 0.15) {
                    this.spawnMonster(getRandomMonster(), x, y);
                } else if (rand < 0.20) {
                    // Increased chance of equipment drops
                    this.spawnItem(getRandomEquipmentType(), x, y);
                } else if (rand < 0.25) {
                    this.spawnItem(Math.random() < 0.5 ? 'healthPotion' : 'healingHerb', x, y);
                } else if (rand < 0.30) {
                    // Spawn NPCs at specific locations
                    if (Math.random() < 0.5) {
                        this.spawnNPC('villager', x, y);
                    }
                }
            }
        }

        // Add starting area monsters (slimes)
        for (let i = 0; i < 6; i++) {
            const x = Utils.random(2, 15);
            const y = Utils.random(2, 9);
            this.spawnMonster('slime', x, y);
        }

        // Add some goblins
        for (let i = 0; i < 3; i++) {
            const x = Utils.random(16, 30);
            const y = Utils.random(2, 9);
            this.spawnMonster('goblin', x, y);
        }


    // Add boss spawn regions based on exploration progress
    this.addBossRegions = function() {
        // Fire Drake's Volcano - hot terrain with lava patches
        const volcanoX = this.width - 2;
        const volcanoY = Math.floor(this.height / 2);
        
        if (this.isFreeTile({x: volcanoX, y: volcanoY})) {
            // Create volcanic terrain pattern
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const vx = volcanoX + dx;
                    const vy = volcanoY + dy;
                    
                    if (Utils.inBounds({x: vx, y: vy}, this.width, this.height) && 
                        !this.isBlockedTile(vx, vy)) {
                        // Lava pools in volcano area
                        if (Math.random() < 0.15) {
                            this.map[vy][vx].type = 'lava';
                        }
                        
                        // Fire drake spawn chance
                        if (Math.random() < 0.3 && !this.monsters.some(m => 
                            Math.abs(m.x - vx) < 2 && Math.abs(m.y - vy) < 2)) {
                            this.spawnMonster('fireDrake', vx, vy);
                        }
                    }
                }
            }
        }
        
        // Ice Dragon's Frozen Peaks - cold mountain region
        const iceX = Math.floor(this.width / 3);
        const iceY = this.height - 2;
        
        if (this.isFreeTile({x: iceX, y: iceY})) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ix = iceX + dx;
                    const iy = iceY + dy;
                    
                    if (Utils.inBounds({x: ix, y: iy}, this.width, this.height) && 
                        !this.isBlockedTile(ix, iy)) {
                        // Snow patches
                        if (Math.random() < 0.12) {
                            this.map[iy][ix].type = 'snow';
                        }
                        
                        // Ice dragon spawn
                        if (Math.random() < 0.3 && !this.monsters.some(m => 
                            Math.abs(m.x - ix) < 2 && Math.abs(m.y - iy) < 2)) {
                            this.spawnMonster('iceDragon', ix, iy);
                        }
                    }
                }
            }
        }
        
        // Shadow Knight's Dark Cavern - shadowy dungeon expansion
        const darkX = Math.floor(this.width / 3);
        const darkY = Math.floor(this.height / 3);
        
        if (this.isFreeTile({x: darkX, y: darkY})) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const dx2 = darkX + dx;
                    const dy2 = darkY + dy;
                    
                    if (Utils.inBounds({x: dx2, y: dy2}, this.width, this.height) && 
                        !this.isBlockedTile(dx2, dy2)) {
                        // Shadowy patches
                        if (Math.random() < 0.1) {
                            this.map[dy2][dx2].type = 'shadow';
                        }
                        
                        // Shadow knight spawn
                        if (Math.random() < 0.3 && !this.monsters.some(m => 
                            Math.abs(m.x - dx2) < 2 && Math.abs(m.y - dy2) < 2)) {
                            this.spawnMonster('shadowKnight', dx2, dy2);
                        }
                    }
                }
            }
        }
        
        // Dark Lord's Abyss - ultimate boss arena
        const abyssX = this.width - 1;
        const abyssY = Math.floor(this.height * 0.75);
        
        if (this.isFreeTile({x: abyssX, y: abyssY})) {
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ax = abyssX + dx;
                    const ay = abyssY + dy;
                    
                    if (Utils.inBounds({x: ax, y: ay}, this.width, this.height) && 
                        !this.isBlockedTile(ax, ay)) {
                        // Dark mist patterns
                        if (Math.random() < 0.08) {
                            this.map[ay][ax].type = 'abyss';
                        }
                        
                        // Dark lord spawn (very rare)
                        if (Math.random() < 0.15 && !this.monsters.some(m => 
                            Math.abs(m.x - ax) < 2 && Math.abs(m.y - ay) < 2)) {
                            this.spawnMonster('darkLord', ax, ay);
                        }
                    }
                }
            }
        }
    };
        // Add wolves in mountain area
        for (let i = 0; i < 3; i++) {
            const x = Utils.random(31, 37);
            const y = Utils.random(2, 9);
            this.spawnMonster('wolf', x, y);
        }

        // Add orcs in dungeon area
        for (let i = 0; i < 3; i++) {
            const x = Utils.random(2, 15);
            const y = Utils.random(10, 21);
            this.spawnMonster('orc', x, y);
        }

        // Add skeletons in dungeon
        for (let i = 0; i < 2; i++) {
            const x = Utils.random(2, 15);
            const y = Utils.random(10, 21);
            this.spawnMonster('skeleton', x, y);
        }

        const nearbySpawnTile = [
            {x: this.player.x, y: this.player.y - 1},
            {x: this.player.x + 1, y: this.player.y},
            {x: this.player.x, y: this.player.y + 1},
            {x: this.player.x - 1, y: this.player.y}
        ].find(tile =>
            Utils.inBounds(tile, this.width, this.height) &&
            [...this.monsters, ...this.items, ...this.npcs].every(entity =>
                !entity.alive || entity.x !== tile.x || entity.y !== tile.y
            )
        );
        if (nearbySpawnTile) {
            this.spawnMonster('slime', nearbySpawnTile.x, nearbySpawnTile.y);
        }

        this.placeNPC('king', this.player.x - 1, this.player.y);
        this.placeNPC('merchant', 5, 3);
        this.placeItem('legendarySword', 5, this.height - 4);
        for (let x = 3; x < 8; x++) {
            this.placeItem('healingHerb', x, 5);
        }
        this.placeMonster('dragon', this.width - 3, this.height - 4);
    },

    findFreeTile(preferredX, preferredY) {
        const candidates = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                candidates.push({ x, y, distance: Math.abs(x - preferredX) + Math.abs(y - preferredY) });
            }
        }
        candidates.sort((a, b) => a.distance - b.distance);
        return candidates.find(({ x, y }) =>
            !this.isBlockedTile(x, y) &&
            !(this.player.x === x && this.player.y === y) &&
            [...this.monsters, ...this.items, ...this.npcs].every(entity =>
                !entity.alive || entity.x !== x || entity.y !== y
            )
        );
    },

    placeNPC(type, x, y) {
        const tile = this.findFreeTile(x, y);
        if (tile) this.spawnNPC(type, tile.x, tile.y);
    },

    placeItem(type, x, y) {
        const tile = this.findFreeTile(x, y);
        if (tile) this.spawnItem(type, tile.x, tile.y);
    },

    placeMonster(type, x, y) {
        const tile = this.findFreeTile(x, y);
        if (tile) this.spawnMonster(type, tile.x, tile.y);
    },

    generateTerrain() {
        for (let y = 0; y < this.height; y++) {
            const riverX = 19 + Math.round(Math.sin(y * 0.45) * 2);
            for (let x = riverX; x < riverX + 2; x++) {
                this.map[y][x] = { type: 'river' };
            }

            if (y === 10) {
                for (let x = riverX - 1; x <= riverX + 2; x++) {
                    this.map[y][x] = { type: 'bridge' };
                }
            }
        }

        const mountainTiles = [
            [29, 13], [30, 13], [31, 13], [32, 13], [33, 13],
            [28, 14], [29, 14], [31, 14], [32, 14], [34, 14],
            [28, 15], [30, 15], [31, 15], [33, 15], [34, 15],
            [29, 16], [30, 16], [32, 16], [33, 16],
            [31, 17], [32, 17]
        ];

        mountainTiles.forEach(([x, y]) => {
            this.map[y][x] = { type: 'mountain' };
        });
    },

    expandWorldToInclude(x, y) {
        while (x < 0) {
            this.expandWorld('west');
            x += this.CHUNK_WIDTH;
        }
        while (x >= this.width) this.expandWorld('east');
        while (y < 0) {
            this.expandWorld('north');
            y += this.CHUNK_HEIGHT;
        }
        while (y >= this.height) this.expandWorld('south');
        return { x, y };
    },

    expandWorld(direction) {
        let region;
        if (direction === 'west' || direction === 'east') {
            const oldWidth = this.width;
            const offset = direction === 'west' ? this.CHUNK_WIDTH : 0;
            this.map.forEach(row => {
                const added = Array(this.CHUNK_WIDTH).fill(null);
                if (direction === 'west') row.unshift(...added);
                else row.push(...added);
            });
            this.width += this.CHUNK_WIDTH;
            if (offset) this.shiftWorldEntities(offset, 0);
            region = {
                x: direction === 'west' ? 0 : oldWidth,
                y: 0,
                width: this.CHUNK_WIDTH,
                height: this.height,
                entry: {
                    x: direction === 'west' ? this.CHUNK_WIDTH - 1 : oldWidth,
                    y: this.player.y
                }
            };
        } else {
            const oldHeight = this.height;
            const offset = direction === 'north' ? this.CHUNK_HEIGHT : 0;
            const addedRows = Array.from(
                { length: this.CHUNK_HEIGHT },
                () => Array(this.width).fill(null)
            );
            if (direction === 'north') this.map.unshift(...addedRows);
            else this.map.push(...addedRows);
            this.height += this.CHUNK_HEIGHT;
            if (offset) this.shiftWorldEntities(0, offset);
            region = {
                x: 0,
                y: direction === 'north' ? 0 : oldHeight,
                width: this.width,
                height: this.CHUNK_HEIGHT,
                entry: {
                    x: this.player.x,
                    y: direction === 'north' ? this.CHUNK_HEIGHT - 1 : oldHeight
                }
            };
        }

        this.generateRegion(region);
        this.updateCamera();
    },

    shiftWorldEntities(dx, dy) {
        [this.player, ...this.monsters, ...this.items, ...this.npcs].forEach(entity => {
            if (!entity) return;
            entity.x += dx;
            entity.y += dy;
        });
    },

    generateRegion(region) {
        const { x, y, width, height, entry } = region;
        const setTerrain = (tileX, tileY, type) => {
            if (tileX >= x && tileX < x + width && tileY >= y && tileY < y + height) {
                this.map[tileY][tileX] = { type };
            }
        };

        // Add a meandering stream through each new region, with bridges to cross it.
        if (Math.random() < 0.5) {
            const centerY = y + Utils.random(4, Math.max(4, height - 5));
            for (let tileX = x; tileX < x + width; tileX++) {
                const streamY = Math.max(y + 1, Math.min(y + height - 2,
                    centerY + Math.round(Math.sin(tileX * 0.25) * 2)));
                setTerrain(tileX, streamY, 'river');
                if (tileX % 17 === 0) setTerrain(tileX, streamY, 'bridge');
            }
        } else {
            const centerX = x + Utils.random(4, Math.max(4, width - 5));
            for (let tileY = y; tileY < y + height; tileY++) {
                const streamX = Math.max(x + 1, Math.min(x + width - 2,
                    centerX + Math.round(Math.sin(tileY * 0.3) * 2)));
                setTerrain(streamX, tileY, 'river');
                if (tileY % 17 === 0) setTerrain(streamX, tileY, 'bridge');
            }
        }

        if (Math.random() < 0.7) {
            const centerX = x + Utils.random(5, Math.max(5, width - 6));
            const centerY = y + Utils.random(4, Math.max(4, height - 5));
            const radiusX = Utils.random(2, 4);
            const radiusY = Utils.random(2, 3);
            for (let tileY = centerY - radiusY; tileY <= centerY + radiusY; tileY++) {
                for (let tileX = centerX - radiusX; tileX <= centerX + radiusX; tileX++) {
                    const lakeDistance = ((tileX - centerX) / radiusX) ** 2 +
                        ((tileY - centerY) / radiusY) ** 2;
                    if (lakeDistance <= 1) setTerrain(tileX, tileY, 'lake');
                }
            }
        }

        if (Math.random() < 0.7) {
            const centerX = x + Utils.random(5, Math.max(5, width - 6));
            const centerY = y + Utils.random(4, Math.max(4, height - 5));
            const radius = Utils.random(2, 4);
            for (let tileY = centerY - radius; tileY <= centerY + radius; tileY++) {
                for (let tileX = centerX - radius; tileX <= centerX + radius; tileX++) {
                    const mountainDistance = Math.abs(tileX - centerX) + Math.abs(tileY - centerY);
                    if (mountainDistance <= radius) setTerrain(tileX, tileY, 'mountain');
                }
            }
        }

        const hasTown = Math.random() < 0.3 && width >= 12 && height >= 10;
        let townCenter = null;
        if (hasTown) {
            const centerX = x + Math.floor(width / 2);
            const centerY = y + Math.floor(height / 2);
            townCenter = { x: centerX, y: centerY };
            for (let offsetY = -3; offsetY <= 3; offsetY++) {
                for (let offsetX = -5; offsetX <= 5; offsetX++) {
                    setTerrain(centerX + offsetX, centerY + offsetY, 'town');
                }
            }
            for (let offsetX = -5; offsetX <= 5; offsetX++) {
                setTerrain(centerX + offsetX, centerY, 'road');
            }
            for (let offsetY = -3; offsetY <= 3; offsetY++) {
                setTerrain(centerX, centerY + offsetY, 'road');
            }
            [[-4, -2], [2, -2], [-4, 1], [2, 1]].forEach(([offsetX, offsetY]) => {
                for (let buildingY = 0; buildingY < 2; buildingY++) {
                    for (let buildingX = 0; buildingX < 2; buildingX++) {
                        setTerrain(centerX + offsetX + buildingX, centerY + offsetY + buildingY, 'house');
                    }
                }
            });
        }

        // Keep the entry tile open even when a stream or mountain crosses the border.
        if (this.map[entry.y]?.[entry.x]) this.map[entry.y][entry.x] = null;

        if (townCenter) {
            this.spawnRegionNPC('merchant', townCenter.x - 2, townCenter.y, region, entry);
            for (let index = 0; index < 3; index++) {
                this.spawnRegionNPC('villager', townCenter.x + index - 1, townCenter.y + 2, region, entry);
            }
        }

        const populationAttempts = Math.min(20, Math.floor(width * height * 0.025));
        for (let index = 0; index < populationAttempts; index++) {
            const tile = this.findFreeRegionTile(region, entry);
            if (!tile) break;

            const roll = Math.random();
            if (roll < 0.45) this.spawnMonster(getRandomMonster(), tile.x, tile.y);
            else if (roll < 0.7) this.spawnItem(Math.random() < 0.5 ? 'healthPotion' : 'healingHerb', tile.x, tile.y);
            else this.spawnNPC('villager', tile.x, tile.y);
        }
    },

    findFreeRegionTile(region, excludedTile) {
        for (let attempt = 0; attempt < 500; attempt++) {
            const tile = {
                x: Utils.random(region.x, region.x + region.width - 1),
                y: Utils.random(region.y, region.y + region.height - 1)
            };
            if ((tile.x === excludedTile.x && tile.y === excludedTile.y) ||
                (tile.x === this.player.x && tile.y === this.player.y) ||
                this.isBlockedTile(tile.x, tile.y) ||
                [...this.monsters, ...this.items, ...this.npcs].some(entity =>
                    entity.alive && entity.x === tile.x && entity.y === tile.y
                )) continue;
            return tile;
        }
        return null;
    },

    spawnRegionNPC(type, x, y, region, excludedTile) {
        const preferred = { x, y };
        if (x >= region.x && x < region.x + region.width &&
            y >= region.y && y < region.y + region.height &&
            !this.isBlockedTile(x, y) &&
            !(x === excludedTile.x && y === excludedTile.y) &&
            !(x === this.player.x && y === this.player.y) &&
            [...this.monsters, ...this.items, ...this.npcs].every(entity =>
                !entity.alive || entity.x !== x || entity.y !== y
            )) {
            this.spawnNPC(type, x, y);
            return;
        }
        const tile = this.findFreeRegionTile(region, excludedTile);
        if (tile) this.spawnNPC(type, tile.x, tile.y);
    },

    updateCamera() {
        this.cameraX = Math.max(0, Math.min(
            this.width - this.viewWidth,
            this.player.x - Math.floor(this.viewWidth / 2)
        ));
        this.cameraY = Math.max(0, Math.min(
            this.height - this.viewHeight,
            this.player.y - Math.floor(this.viewHeight / 2)
        ));
    },

    isBlockedTile(x, y) {
        const terrain = this.map[y]?.[x]?.type;
        return terrain === 'river' || terrain === 'lake' || terrain === 'mountain' || terrain === 'house';
    },

    spawnMonster(type, x, y) {
        if (Utils.inBounds({x, y}, this.width, this.height) && !this.isBlockedTile(x, y)) {
            this.monsters.push(Entities.createMonster(type, x, y));
        }
    },

    spawnItem(type, x, y) {
        if (Utils.inBounds({x, y}, this.width, this.height) && !this.isBlockedTile(x, y)) {
            this.items.push(Entities.createItem(type, x, y));
        }
    },

    spawnNPC(type, x, y) {
        if (Utils.inBounds({x, y}, this.width, this.height) && !this.isBlockedTile(x, y)) {
            this.npcs.push(Entities.createNPC(type, x, y));
        }
    },

    // Remove an entity from the world

    removeEntity(entity) {
        const index = this.monsters.findIndex(m => m.id === entity.id);
        if (index !== -1) {
            this.monsters.splice(index, 1);
        }
    },

    // Explore action - move randomly or to nearby unexplored area
});
