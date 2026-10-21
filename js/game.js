// Main Game Logic for RPG Adventure

const Game = {
    canvas: null,
    ctx: null,
    TILE_SIZE: 40,
    CHUNK_WIDTH: 38,
    CHUNK_HEIGHT: 22,
    
    // Game world
    width: 50,
    height: 30,
    viewWidth: 38,
    viewHeight: 22,
    cameraX: 0,
    cameraY: 0,
    map: [],
    player: null,
    
    // Entities
    monsters: [],
    items: [],
    npcs: [],
    shopStock: {
        healthPotion: 12,
        healingHerb: 5,
        manaPotion: 10,
        sword: 80,
        shield: 55,
        leatherArmor: 70,
        chainmail: 160,
        goldRing: 100,
        silverRing: 180,
        luckyCharm: 130
    },
    
    // Current biome
    currentBiome: Entities.Biomes.forest,
    
    // Game state
    gameState: 'start', // start, playing, gameover
    difficulty: 'medium',
    difficultySettings: {
        easy: { label: 'Easy', monsterDamageMultiplier: 0.7, goldMultiplier: 1.25 },
        medium: { label: 'Medium', monsterDamageMultiplier: 1, goldMultiplier: 1 },
        hard: { label: 'Hard', monsterDamageMultiplier: 1.5, goldMultiplier: 1.5 }
    },
    characterCreationStep: 0,
    currentSaveSlot: null,
    saveSlotMode: 'load',
    saveSlotReturnToStartup: false,

    getDifficultySettings() {
        return Object.hasOwn(this.difficultySettings, this.difficulty)
            ? this.difficultySettings[this.difficulty]
            : this.difficultySettings.medium;
    },

    updateDifficultyDisplay() {
        document.getElementById('difficulty-display').textContent = this.getDifficultySettings().label;
    },
    
    // Initialize the game
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Keep the viewport fixed while the explored world expands.
        this.width = 38;
        this.height = 22;
        this.viewWidth = this.width;
        this.viewHeight = this.height;
        this.canvas.width = this.viewWidth * this.TILE_SIZE;
        this.canvas.height = this.viewHeight * this.TILE_SIZE;
        
        // Create player
        this.player = new Entities.Player('Hero');
        this.player.updateStatsDisplay();
        this.updateGoldDisplay();
        
        // Initialize quest system
        QuestSystem.init(this.player);
        
        // Generate initial world
        this.generateWorld();
        this.updateCamera();
        
        // Render initial state
        this.render();
        
        // Setup event listeners
        this.setupEventListeners();
        this.updateStartupAvailability();
        document.getElementById('startup-menu').showModal();
    },

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
                } else if (rand < 0.18) {
                    this.spawnItem(getRandomEquipmentType(), x, y);
                } else if (rand < 0.2) {
                    this.spawnItem(Math.random() < 0.5 ? 'healthPotion' : 'healingHerb', x, y);
                } else if (rand < 0.25) {
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
    explore() {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        // Move in random direction
        const directions = [
            {dx: 0, dy: -1}, // up
            {dx: 0, dy: 1},  // down
            {dx: -1, dy: 0}, // left
            {dx: 1, dy: 0}   // right
        ];
        
        const direction = directions[Utils.random(0, directions.length - 1)];
        const destination = this.expandWorldToInclude(
            this.player.x + direction.dx,
            this.player.y + direction.dy
        );
        const newX = destination.x;
        const newY = destination.y;

        if (this.isBlockedTile(newX, newY)) {
            GameAudio.blocked();
            Utils.showMessage(this.getBlockedTerrainMessage(newX, newY), 'warning');
        } else {
            // Add visual feedback for movement
            this.renderMovementEffect(newX, newY);
            
            this.player.x = newX;
            this.player.y = newY;
            GameAudio.move();
            this.updateCamera();
            this.moveWorldEntities();
            
            // Show movement message
            Utils.showMessage(`Moved ${this.getDirectionText(direction)}`, 'info');
            
            // Check for encounters
            this.checkEncounters();
            
            // Try to collect nearby items
            this.tryCollectItem();
            this.monstersTurn();
        }

        this.render();
    },

    // Movement functions for directional buttons
    moveNorth() {
        this.movePlayer(0, -1);
    },

    moveSouth() {
        this.movePlayer(0, 1);
    },

    moveWest() {
        this.movePlayer(-1, 0);
    },

    moveEast() {
        this.movePlayer(1, 0);
    },

    // Generic movement function with direction text
    movePlayer(dx, dy) {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        const destination = this.expandWorldToInclude(
            this.player.x + dx,
            this.player.y + dy
        );
        const newX = destination.x;
        const newY = destination.y;

        if (this.isBlockedTile(newX, newY)) {
            GameAudio.blocked();
            Utils.showMessage(this.getBlockedTerrainMessage(newX, newY), 'warning');
        } else {
            // Add visual feedback for movement
            this.renderMovementEffect(newX, newY);
            
            this.player.x = newX;
            this.player.y = newY;
            GameAudio.move();
            this.updateCamera();
            this.moveWorldEntities();
            
            // Show direction message
            const directionText = this.getDirectionText({dx, dy});
            Utils.showMessage(`Moved ${directionText}`, 'info');
            
            // Check for encounters
            this.checkEncounters();
            
            // Try to collect nearby items
            this.tryCollectItem();
            this.monstersTurn();
        }

        this.render();
    },

    moveWorldEntities() {
        const entities = Utils.shuffle([
            ...this.monsters.filter(monster => monster.alive),
            ...this.npcs.filter(npc => npc.alive)
        ]);
        const occupiedTiles = new Map();
        const addOccupant = entity => {
            const key = `${entity.x},${entity.y}`;
            occupiedTiles.set(key, (occupiedTiles.get(key) || 0) + 1);
        };
        const removeOccupant = entity => {
            const key = `${entity.x},${entity.y}`;
            const count = occupiedTiles.get(key);
            if (count === 1) occupiedTiles.delete(key);
            else if (count > 1) occupiedTiles.set(key, count - 1);
        };

        [...entities, ...this.items.filter(item => item.alive)].forEach(addOccupant);
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        entities.forEach(entity => {
            if (Math.random() >= 0.5) return;

            removeOccupant(entity);
            const destination = Utils.shuffle(directions).map(({ dx, dy }) => ({
                x: entity.x + dx,
                y: entity.y + dy
            })).find(tile =>
                Utils.inBounds(tile, this.width, this.height) &&
                !this.isBlockedTile(tile.x, tile.y) &&
                !(tile.x === this.player.x && tile.y === this.player.y) &&
                !occupiedTiles.has(`${tile.x},${tile.y}`)
            );

            if (destination) {
                entity.x = destination.x;
                entity.y = destination.y;
            }
            addOccupant(entity);
        });
    },

    getBlockedTerrainMessage(x, y) {
        const terrain = this.map[y]?.[x]?.type;
        if (terrain === 'river' || terrain === 'lake') {
            return 'The water is too deep to cross here. Find a bridge or another route!';
        }
        return terrain === 'house'
            ? 'A building blocks your way!'
            : 'The mountains block your way. Find a pass!';
    },

    // Helper: Get direction text for movement feedback
    getDirectionText(direction) {
        const directions = [
            {dx: 0, dy: -1}, // up
            {dx: 0, dy: 1},  // down
            {dx: -1, dy: 0}, // left
            {dx: 1, dy: 0}   // right
        ];
        const dir = directions.find(d => d.dx === direction.dx && d.dy === direction.dy);
        return dir ? (dir.dy < 0 ? 'North' : dir.dy > 0 ? 'South' : dir.dx < 0 ? 'West' : 'East') : 'random';
    },

    // Render movement effect when player moves
    renderMovementEffect(x, y) {
        const screenX = (x - this.cameraX) * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = (y - this.cameraY) * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        // Draw a trail effect - brighter and more visible
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, this.TILE_SIZE * 0.45, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'; // Purple trail for player
        this.ctx.fill();
    },

    // Update static HUD health bars
    updateHUDHealthBars() {
        // Update player health bar
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        const playerHpBar = document.getElementById('player-hp-bar');
        playerHpBar.max = this.player.maxHp;
        playerHpBar.value = this.player.hp;
        document.getElementById('player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        
        // Color coding for player HP
        if (playerHpPercent > 60) {
            playerHpBar.style.background = '#22c55e';
        } else if (playerHpPercent > 30) {
            playerHpBar.style.background = '#fbbf24';
        } else {
            playerHpBar.style.background = '#ef4444';
        }

        // Update targeted enemy health bar if in combat
        this.updateEnemyHealthBar();
    },

    // Set the currently targeted enemy for combat display
    setTargetedEnemy(monster) {
        if (monster && monster.alive) {
            const container = document.getElementById('enemy-hp-container');
            const hpText = document.getElementById('enemy-hp-text');
            const nameDisplay = document.getElementById('enemy-name-display');
            
            // Show enemy health bar
            container.classList.remove('hidden');
            nameDisplay.style.display = 'inline';
            nameDisplay.textContent = monster.name;
            
            // Update enemy HP bar
            const enemyHpPercent = (monster.hp / monster.maxHp) * 100;
            document.getElementById('enemy-hp-bar').value = monster.hp;
            document.getElementById('enemy-hp-bar').max = monster.maxHp;
            
            // Color coding for enemy HP
            const enemyHpBar = document.getElementById('enemy-hp-bar');
            if (enemyHpPercent > 60) {
                enemyHpBar.style.background = '#22c55e';
            } else if (enemyHpPercent > 30) {
                enemyHpBar.style.background = '#fbbf24';
            } else {
                enemyHpBar.style.background = '#ef4444';
            }
            
            hpText.textContent = `${monster.hp}/${monster.maxHp} HP`;
        } else {
            // Hide enemy health bar when not in combat
            document.getElementById('enemy-hp-container').classList.add('hidden');
        }
    },

    // Update enemy health bar (call after each attack)
    updateEnemyHealthBar() {
        // Find all alive monsters and find the closest one (currently targeted)
        const aliveMonsters = this.monsters.filter(m => m.alive);
        if (aliveMonsters.length === 0) {
            this.setTargetedEnemy(null);
            return;
        }

        // Find nearest monster to player
        let nearest = null;
        let minDistance = Infinity;
        for (const m of aliveMonsters) {
            const dist = Utils.distance(this.player, m);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = m;
            }
        }

        this.setTargetedEnemy(nearest);
    },

    // Flash monster to show it was hit
    flashMonster(monster) {
        const screenX = (monster.x - this.cameraX) * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = (monster.y - this.cameraY) * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        // Draw a yellow flash effect
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, this.TILE_SIZE * (monster.size || 1) * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        this.ctx.fill();
    },

    // Try to collect an item if player is adjacent to one
    tryCollectItem() {
        const pickupTiles = [
            {dx: 0, dy: 0},
            {dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}
        ];
        
        for (const dir of pickupTiles) {
            const targetX = this.player.x + dir.dx;
            const targetY = this.player.y + dir.dy;
            
            // Check items
            const itemIndex = this.items.findIndex(item => 
                item.alive && 
                item.x === targetX && 
                item.y === targetY
            );
            
            if (itemIndex !== -1) {
                const item = this.items[itemIndex];
                // Collect the item
                item.alive = false;
                GameAudio.pickup();
                this.player.addInventoryItem(item);
                
                // Find and complete collection quest using helper method
                const collectQuests = QuestSystem.getCollectQuestsByTarget(item.type);
                if (collectQuests.length > 0) {
                    // Complete the first active quest for this target type
                    const quest = collectQuests[0];
                    // Add progress to the quest
                    QuestSystem.completeObjective(quest.id, {
                        type: 'collect',
                        target: item.type,
                        quantity: 1
                    });
                }
                
                Utils.showMessage(`Picked up: ${item.name}!`, 'success');
                this.render();
                return;
            }
        }
    },

    // Check for random encounters with monsters
    checkEncounters() {
        const nearbyMonsters = this.monsters.filter(m => 
            Utils.distance(this.player, m) <= 2
        );

        if (nearbyMonsters.length > 0) {
            const monsterIndex = Utils.random(0, nearbyMonsters.length - 1);
            const targetMonster = nearbyMonsters[monsterIndex];
            
            // Show encounter message
            Utils.showMessage(`A ${targetMonster.name} appears!`, 'warning');
        }
    },

    // Rest action - restore HP
    rest() {
        if (this.player.hp <= 0) return;
        
        const healAmount = Utils.random(15, 25);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        GameAudio.heal();
        const goldBonus = this.player.getEquipmentBonus('goldPerRest');
        if (goldBonus > 0) {
            this.addGold(goldBonus);
        }

        Utils.showMessage(
            goldBonus > 0
                ? `Restored ${healAmount} HP and earned ${goldBonus} gold!`
                : `Restored ${healAmount} HP!`,
            'success'
        );
        this.render();
    },

    // Use an item from inventory
    useItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;
        
        const item = this.player.inventory[itemIndex];
        const itemTemplate = Entities.Items[item.type];
        if (itemTemplate?.equipmentSlot) {
            Utils.showMessage(`${item.name} must be equipped from the inventory.`, 'warning');
            return;
        }
        if (!itemTemplate) {
            Utils.showMessage(`Cannot use ${item.name}: item data is missing.`, 'error');
            return;
        }
        const effect = itemTemplate.effect();
        if (effect.mp && this.player.maxMp === 0) {
            Utils.showMessage(`${this.player.className} cannot use mana potions.`, 'warning');
            return;
        }
        
        // Apply effects
        if (effect.hp) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.hp);
        if (effect.mp) this.player.mp = Math.min(this.player.maxMp, this.player.mp + effect.mp);
        if (effect.strength) this.player.stats.strength += effect.strength;
        if (effect.hp || effect.mp) GameAudio.heal();
        
        // Remove item
        this.player.removeInventoryItem(itemId);
        
        Utils.showMessage(`Used ${item.name}!`, 'success');
        this.updateInventoryDisplay();
        this.render();
    },

    equipItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.player.inventory[itemIndex];
        const itemTemplate = Entities.Items[item.type];
        const slot = itemTemplate?.equipmentSlot;
        if (!slot) return;

        const previousItem = this.player.equipment[slot];
        if (previousItem) {
            this.player.inventory.push(previousItem);
        }

        this.player.inventory.splice(itemIndex, 1);
        this.player.equipment[slot] = {
            ...item,
            equipmentSlot: slot,
            bonuses: itemTemplate.bonuses
        };

        this.player.updateStatsDisplay();
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.render();
        Utils.showMessage(`Equipped ${item.name}.`, 'success');
    },

    unequipItem(slot) {
        const item = this.player.equipment[slot];
        if (!item) return;

        this.player.inventory.push(item);
        this.player.equipment[slot] = null;
        this.player.updateStatsDisplay();
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.render();
        Utils.showMessage(`Unequipped ${item.name}.`, 'info');
    },

    // Add gold
    addGold(amount) {
        const currentGold = this.getGold();
        localStorage.setItem('rpg_gold', currentGold + amount);
        this.updateGoldDisplay();
        Utils.showMessage(`+${amount} gold!`, 'success');
    },

    updateGoldDisplay() {
        document.getElementById('gold-display').textContent = this.getGold().toLocaleString();
    },

    getGold() {
        const gold = Number.parseInt(localStorage.getItem('rpg_gold') || '0', 10);
        return Number.isFinite(gold) ? Math.max(0, gold) : 0;
    },

    spendGold(amount) {
        if (!Number.isInteger(amount) || amount < 0 || this.getGold() < amount) return false;
        localStorage.setItem('rpg_gold', this.getGold() - amount);
        this.updateGoldDisplay();
        return true;
    },

    buyItem(type) {
        const price = this.shopStock[type];
        const template = Entities.Items[type];
        if (!template || !price) {
            Utils.showMessage('That item is not available in the shop.', 'error');
            return;
        }
        if (!this.spendGold(price)) {
            Utils.showMessage(`You need ${price} gold to buy ${template.name}.`, 'warning');
            return;
        }
        this.player.addInventoryItem(Entities.createItem(type, this.player.x, this.player.y));
        this.updateTradeDisplay();
        Utils.showMessage(`Bought ${template.name} for ${price} gold.`, 'success');
    },

    sellItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        const item = this.player.inventory[itemIndex];
        const basePrice = this.shopStock[item.type];
        if (!basePrice) {
            Utils.showMessage(`${item.name} cannot be sold here.`, 'warning');
            return;
        }
        const sellPrice = Math.max(1, Math.floor(basePrice / 2));
        this.player.inventory.splice(itemIndex, 1);
        this.addGold(sellPrice);
        window.updateInventoryDisplay();
        this.updateTradeDisplay();
        Utils.showMessage(`Sold ${item.name} for ${sellPrice} gold.`, 'success');
    },

    updateTradeDisplay() {
        const container = document.getElementById('interaction-content');
        container.innerHTML = `
            <p>Your gold: <strong>${this.getGold().toLocaleString()}</strong></p>
            <h4>Buy</h4>
            <div class="shop-list">
                ${Object.entries(this.shopStock).map(([type, price]) => {
                    const item = Entities.Items[type];
                    return `<div class="shop-item">
                        <span>${item.symbol} <strong>${item.name}</strong><small>${item.description}</small></span>
                        <button type="button" data-buy-item="${type}">Buy · ${price}g</button>
                    </div>`;
                }).join('')}
            </div>
            <h4>Sell</h4>
            ${this.player.inventory.length
                ? `<div class="shop-list">${this.player.inventory.map(item => {
                    const price = this.shopStock[item.type];
                    const value = price ? Math.max(1, Math.floor(price / 2)) : 0;
                    return `<div class="shop-item">
                        <span>${item.symbol} <strong>${item.name}</strong><small>${value ? `Sell value: ${value}g` : 'Not accepted'}</small></span>
                        ${value ? `<button type="button" data-sell-item="${item.id}">Sell · ${value}g</button>` : ''}
                    </div>`;
                }).join('')}</div>`
                : '<p>Your inventory is empty.</p>'}
            <p class="shop-note">Equipped gear must be unequipped before it can be sold. Sell prices are half the shop price.</p>
        `;
        container.querySelectorAll('[data-buy-item]').forEach(button => {
            button.addEventListener('click', () => this.buyItem(button.dataset.buyItem));
        });
        container.querySelectorAll('[data-sell-item]').forEach(button => {
            button.addEventListener('click', () => this.sellItem(button.dataset.sellItem));
        });
    },

    interact() {
        const npc = this.npcs
            .filter(candidate => candidate.alive)
            .sort((a, b) => Utils.distance(this.player, a) - Utils.distance(this.player, b))[0];
        if (!npc || Utils.distance(this.player, npc) > 2) {
            Utils.showMessage('Move next to a character to talk to them.', 'warning');
            return;
        }
        this.openNPCInteraction(npc);
    },

    openNPCInteraction(npc) {
        const panel = document.getElementById('interaction-panel');
        const title = document.getElementById('interaction-title');
        const content = document.getElementById('interaction-content');
        panel.hidden = false;
        title.textContent = npc.name;

        if (npc.type === 'merchant') {
            panel.dataset.type = 'merchant';
            this.updateTradeDisplay();
        } else if (npc.type === 'king') {
            panel.dataset.type = 'quests';
            QuestSystem.renderQuestBoard(this.player, true);
        } else {
            panel.dataset.type = 'villager';
            content.textContent = npc.dialogue;
        }
        panel.scrollIntoView({ block: 'nearest' });
    },

    // Render the game
    render() {
        this.updateHUDHealthBars();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.cameraX * this.TILE_SIZE, -this.cameraY * this.TILE_SIZE);
        SpriteRenderer.drawTerrain(this);
        this.drawGrid();

        this.items.filter(item => item.alive && this.isInViewport(item)).forEach(item => {
            SpriteRenderer.drawItem(this, item);
        });

        this.npcs.filter(npc => npc.alive && this.isInViewport(npc)).forEach(npc => {
            SpriteRenderer.drawNPC(this, npc);
        });
        
        this.monsters.filter(monster => monster.alive && this.isInViewport(monster)).forEach(monster => {
            SpriteRenderer.drawMonster(this, monster);
        });
        SpriteRenderer.drawHero(this);
        SpriteRenderer.drawHero(this);
        this.ctx.restore();
    },

    isInViewport(entity) {
        return entity.x >= this.cameraX && entity.x < this.cameraX + this.viewWidth &&
            entity.y >= this.cameraY && entity.y < this.cameraY + this.viewHeight;
    },

    drawTerrain() {
        for (let screenY = 0; screenY < this.viewHeight; screenY++) {
            for (let screenX = 0; screenX < this.viewWidth; screenX++) {
                const worldX = this.cameraX + screenX;
                const worldY = this.cameraY + screenY;
                const type = this.map[worldY]?.[worldX]?.type;
                const left = worldX * this.TILE_SIZE;
                const top = worldY * this.TILE_SIZE;

                if (type === 'river' || type === 'lake') {
                    this.ctx.fillStyle = '#0284c7';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 8, top + 14);
                    this.ctx.quadraticCurveTo(left + 20, top + 8, left + 32, top + 14);
                    this.ctx.moveTo(left + 5, top + 29);
                    this.ctx.quadraticCurveTo(left + 18, top + 23, left + 30, top + 29);
                    this.ctx.stroke();
                } else if (type === 'bridge') {
                    this.ctx.fillStyle = '#92400e';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.strokeStyle = '#fcd34d';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 3, top + 12);
                    this.ctx.lineTo(left + this.TILE_SIZE - 3, top + 12);
                    this.ctx.moveTo(left + 3, top + 28);
                    this.ctx.lineTo(left + this.TILE_SIZE - 3, top + 28);
                    this.ctx.stroke();
                } else if (type === 'mountain') {
                    this.ctx.fillStyle = '#6b7280';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.font = `${this.TILE_SIZE * 0.8}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('⛰️', left + this.TILE_SIZE / 2, top + this.TILE_SIZE / 2);
                } else if (type === 'town' || type === 'road') {
                    this.ctx.fillStyle = type === 'road' ? '#a16207' : '#4b7351';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    if (type === 'road') {
                        this.ctx.fillStyle = 'rgba(253, 230, 138, 0.45)';
                        this.ctx.fillRect(left + 4, top + 4, this.TILE_SIZE - 8, this.TILE_SIZE - 8);
                    }
                } else if (type === 'house') {
                    this.ctx.fillStyle = '#78350f';
                    this.ctx.fillRect(left + 5, top + 13, this.TILE_SIZE - 10, this.TILE_SIZE - 15);
                    this.ctx.fillStyle = '#b91c1c';
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 2, top + 15);
                    this.ctx.lineTo(left + this.TILE_SIZE / 2, top + 2);
                    this.ctx.lineTo(left + this.TILE_SIZE - 2, top + 15);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
    },

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(24, 31, 45, 0.14)';
        this.ctx.lineWidth = 1;
        
        for (let x = this.cameraX; x <= this.cameraX + this.viewWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.TILE_SIZE, 0);
            this.ctx.lineTo(x * this.TILE_SIZE, (this.cameraY + this.viewHeight) * this.TILE_SIZE);
            this.ctx.stroke();
        }
        
        for (let y = this.cameraY; y <= this.cameraY + this.viewHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.TILE_SIZE);
            this.ctx.lineTo((this.cameraX + this.viewWidth) * this.TILE_SIZE, y * this.TILE_SIZE);
            this.ctx.stroke();
        }
    },

    drawEntity(x, y, symbol, color, size) {
        const screenX = x * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = y * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        // Draw colored circle background
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, this.TILE_SIZE * size * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.stroke();
        
        // Draw symbol
        this.ctx.font = `bold ${this.TILE_SIZE * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(symbol, screenX, screenY);
    },

    drawSpriteShadow(x, y) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(x, y + 12, 12, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
        ctx.fill();
    },

    drawFace(x, y, skin = '#f1c8a5', eyeColor = '#172033') {
        const ctx = this.ctx;
        ctx.fillStyle = skin;
        ctx.strokeStyle = '#422b2b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, 6.5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(x - 2.5, y, 0.9, 0, Math.PI * 2);
        ctx.arc(x + 2.5, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
    },

    drawHeroSprite() {
        const ctx = this.ctx;
        const x = (this.player.x + 0.5) * this.TILE_SIZE;
        const y = (this.player.y + 0.5) * this.TILE_SIZE;
        const scale = this.TILE_SIZE / 40;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        this.drawSpriteShadow(0, 0);

        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#7f1d1d';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(8, -8);
        ctx.lineTo(12, 3);
        ctx.lineTo(8, 15);
        ctx.lineTo(0, 12);
        ctx.lineTo(-8, 15);
        ctx.lineTo(-12, 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(-8, -9);
        ctx.lineTo(8, -9);
        ctx.lineTo(10, 2);
        ctx.lineTo(7, 10);
        ctx.lineTo(0, 13);
        ctx.lineTo(-7, 10);
        ctx.lineTo(-10, 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#172554';
        ctx.stroke();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, -5);
        ctx.lineTo(-5, 7);
        ctx.moveTo(7, -5);
        ctx.lineTo(5, 7);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-7, 0, 14, 2);

        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(-10, -3, 3.5, 5, -0.25, 0, Math.PI * 2);
        ctx.ellipse(10, -3, 3.5, 5, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        this.drawFace(0, -10, '#f1c8a5');
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-7, -13);
        ctx.lineTo(-7, -17);
        ctx.lineTo(-4, -20);
        ctx.lineTo(4, -20);
        ctx.lineTo(7, -17);
        ctx.lineTo(7, -13);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-7, -14, 14, 2);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(3, -17);
        ctx.lineTo(0, -15);
        ctx.lineTo(-3, -17);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.translate(13, 1);
        ctx.rotate(0.35);
        ctx.shadowColor = 'rgba(125, 211, 252, 0.95)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -17);
        ctx.lineTo(2, -17);
        ctx.lineTo(1.5, 1);
        ctx.lineTo(0, 4);
        ctx.lineTo(-1.5, 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-5, 3, 10, 2);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-1, 5, 2, 6);
        ctx.restore();
        ctx.restore();
    },

    drawMonsterSprite(monster) {
        const ctx = this.ctx;
        const x = (monster.x + 0.5) * this.TILE_SIZE;
        const y = (monster.y + 0.5) * this.TILE_SIZE;
        const scale = (this.TILE_SIZE / 40) * Math.min(monster.size || 1, 1.2);

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        this.drawSpriteShadow(0, 0);

        if (monster.type === 'slime') {
            ctx.fillStyle = '#22c55e';
            ctx.strokeStyle = '#14532d';
            ctx.beginPath();
            ctx.moveTo(-13, 7);
            ctx.quadraticCurveTo(-16, 1, -10, -5);
            ctx.quadraticCurveTo(0, -14, 10, -5);
            ctx.quadraticCurveTo(16, 1, 13, 7);
            ctx.quadraticCurveTo(0, 12, -13, 7);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'rgba(220, 252, 231, 0.8)';
            ctx.beginPath();
            ctx.ellipse(-5, -5, 3, 1.5, -0.5, 0, Math.PI * 2);
            ctx.fill();
            this.drawFace(0, 1, '#dcfce7');
        } else if (monster.type === 'wolf') {
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.ellipse(-1, 2, 13, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-9, -3);
            ctx.lineTo(-11, -13);
            ctx.lineTo(-3, -7);
            ctx.lineTo(4, -8);
            ctx.lineTo(11, -13);
            ctx.lineTo(10, -3);
            ctx.lineTo(15, 2);
            ctx.lineTo(8, 7);
            ctx.lineTo(-8, 7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath();
            ctx.moveTo(-9, -7);
            ctx.lineTo(-10, -11);
            ctx.lineTo(-6, -8);
            ctx.moveTo(7, -8);
            ctx.lineTo(10, -11);
            ctx.lineTo(9, -6);
            ctx.fill();
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.moveTo(8, 1);
            ctx.lineTo(16, 3);
            ctx.lineTo(8, 5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.arc(7, -3, 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else if (monster.type === 'skeleton') {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-6, 2);
            ctx.lineTo(-7, 10);
            ctx.moveTo(6, 2);
            ctx.lineTo(7, 10);
            ctx.moveTo(-7, 4);
            ctx.lineTo(7, 4);
            ctx.stroke();
            ctx.fillStyle = '#e2e8f0';
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.ellipse(0, -7, 9, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(-3, -8, 2, 0, Math.PI * 2);
            ctx.arc(3, -8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-4, -1);
            ctx.lineTo(4, -1);
            ctx.stroke();
        } else if (monster.type === 'dragon') {
            ctx.fillStyle = '#9333ea';
            ctx.strokeStyle = '#3b0764';
            ctx.beginPath();
            ctx.moveTo(-7, 1);
            ctx.lineTo(-19, -11);
            ctx.lineTo(-14, 4);
            ctx.lineTo(-7, 8);
            ctx.lineTo(7, 8);
            ctx.lineTo(14, 4);
            ctx.lineTo(19, -11);
            ctx.lineTo(7, 1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 3, 9, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -8, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(-3, -9, 1.2, 0, Math.PI * 2);
            ctx.arc(3, -9, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fef3c7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-4, 11);
            ctx.lineTo(0, 16);
            ctx.lineTo(4, 11);
            ctx.stroke();
        } else {
            const isOrc = monster.type === 'orc';
            const skin = isOrc ? '#b91c1c' : '#65a30d';
            ctx.fillStyle = skin;
            ctx.strokeStyle = isOrc ? '#450a0a' : '#365314';
            ctx.beginPath();
            ctx.moveTo(-8, -10);
            ctx.lineTo(-15, -15);
            ctx.lineTo(-13, -5);
            ctx.lineTo(-11, 7);
            ctx.lineTo(-7, 11);
            ctx.lineTo(7, 11);
            ctx.lineTo(11, 7);
            ctx.lineTo(13, -5);
            ctx.lineTo(15, -15);
            ctx.lineTo(8, -10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(-9, 2, 18, 7);
            ctx.strokeRect(-9, 2, 18, 7);
            this.drawFace(0, -6, skin, '#1f2937');
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(-5, -2);
            ctx.lineTo(-2, 1);
            ctx.lineTo(-7, 1);
            ctx.moveTo(5, -2);
            ctx.lineTo(2, 1);
            ctx.lineTo(7, 1);
            ctx.fill();
        }
        ctx.restore();
    },

    drawNpcSprite(npc) {
        const ctx = this.ctx;
        const x = (npc.x + 0.5) * this.TILE_SIZE;
        const y = (npc.y + 0.5) * this.TILE_SIZE;
        const isKing = npc.type === 'king';
        const isMerchant = npc.type === 'merchant';
        const coat = isKing ? '#2563eb' : isMerchant ? '#059669' : '#b45309';

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(this.TILE_SIZE / 40, this.TILE_SIZE / 40);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#422b2b';
        this.drawSpriteShadow(0, 0);

        ctx.fillStyle = coat;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-7, -7);
        ctx.lineTo(7, -7);
        ctx.lineTo(10, 0);
        ctx.lineTo(8, 10);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.drawFace(0, -10, '#e7bd91');

        if (isKing) {
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#78350f';
            ctx.beginPath();
            ctx.moveTo(-8, -16);
            ctx.lineTo(-7, -23);
            ctx.lineTo(-2, -19);
            ctx.lineTo(0, -25);
            ctx.lineTo(3, -19);
            ctx.lineTo(8, -23);
            ctx.lineTo(8, -16);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (isMerchant) {
            ctx.fillStyle = '#92400e';
            ctx.beginPath();
            ctx.moveTo(-12, -14);
            ctx.lineTo(0, -23);
            ctx.lineTo(12, -14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillRect(-9, -14, 18, 3);
            ctx.strokeRect(-9, -14, 18, 3);
        } else {
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.ellipse(0, -15, 8, 4, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-8, -15, 16, 3);
        }
        ctx.restore();
    },

    drawHealthBar(x, y, current, max) {
        const screenX = x * this.TILE_SIZE + 5;
        const screenY = (y + 3) * this.TILE_SIZE + 5;
        const barWidth = this.TILE_SIZE - 10;
        const barHeight = 8;
        const healthPercent = current / max;
        
        // Background
        this.ctx.fillStyle = '#1f2937';
        this.ctx.fillRect(screenX, screenY, barWidth, barHeight);
        
        // Health - more vibrant colors for player
        this.ctx.fillStyle = healthPercent > 0.6 ? '#22c55e' : 
                             healthPercent > 0.3 ? '#fbbf24' : '#ef4444';
        this.ctx.fillRect(screenX, screenY, barWidth * healthPercent, barHeight);
    },

    // Draw monster health bar (above the monster)
    drawMonsterHealthBar(x, y, current, max) {
        const screenX = x * this.TILE_SIZE + 5;
        const screenY = (y - 1) * this.TILE_SIZE + 2; // Above the monster
        const barWidth = this.TILE_SIZE - 8;
        const barHeight = 6;
        const healthPercent = current / max;
        
        // Background
        this.ctx.fillStyle = '#374151';
        this.ctx.fillRect(screenX, screenY, barWidth, barHeight);
        
        // Health color based on percentage
        this.ctx.fillStyle = healthPercent > 0.6 ? '#22c55e' : 
                             healthPercent > 0.3 ? '#eab308' : '#ef4444';
        this.ctx.fillRect(screenX, screenY, barWidth * healthPercent, barHeight);
    },

    renderCombatFeedback(x, y, text, color) {
        const screenX = (x - this.cameraX) * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = (y - this.cameraY - 1) * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, screenX, screenY);
    },

    // Setup event listeners for buttons
    setupEventListeners() {
        document.addEventListener('pointerdown', () => GameAudio.unlock(), { once: true });
        document.addEventListener('keydown', () => GameAudio.unlock(), { once: true });

        document.getElementById('load-saved-game').addEventListener('click', () => {
            this.openSaveSlotPicker('load', true);
        });
        document.getElementById('new-adventure').addEventListener('click', () => {
            document.getElementById('startup-menu').close();
            this.characterCreationStep = 0;
            this.renderCharacterCreationStep();
            document.getElementById('character-creation').showModal();
        });
        document.getElementById('close-save-slots').addEventListener('click', () => {
            document.getElementById('save-slot-dialog').close();
        });
        document.getElementById('save-slot-dialog').addEventListener('close', () => {
            if (this.saveSlotReturnToStartup) document.getElementById('startup-menu').showModal();
        });
        document.getElementById('character-creation-form').addEventListener('submit', event => {
            event.preventDefault();
            if (this.characterCreationStep < 2) {
                this.advanceCharacterCreation();
            } else {
                const name = document.getElementById('hero-name').value.trim();
                const classId = document.querySelector('input[name="hero-class"]:checked')?.value;
                const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
                document.getElementById('hero-name').setCustomValidity('');
                this.startAdventure(name, classId, difficulty);
            }
        });
        document.getElementById('character-next').addEventListener('click', () =>
            this.advanceCharacterCreation()
        );
        document.getElementById('character-back').addEventListener('click', () => {
            this.characterCreationStep = Math.max(0, this.characterCreationStep - 1);
            this.renderCharacterCreationStep();
        });
        document.getElementById('hero-name').addEventListener('input', event => {
            event.currentTarget.setCustomValidity('');
        });
        document.querySelectorAll('input[name="hero-class"]').forEach(input => {
            input.addEventListener('change', () => this.updateClassDescription());
        });

        // Directional movement buttons
        document.getElementById('move-north').addEventListener('click', () => this.moveNorth());
        document.getElementById('move-south').addEventListener('click', () => this.moveSouth());
        document.getElementById('move-west').addEventListener('click', () => this.moveWest());
        document.getElementById('move-east').addEventListener('click', () => this.moveEast());

        // Keyboard arrow key bindings for directional movement
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    this.moveNorth();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.moveSouth();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.moveWest();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.moveEast();
                    break;
            }
        });

        // Explore button (random movement)
        document.getElementById('explore-btn').addEventListener('click', () => this.explore());
        
        // Other action buttons
        document.getElementById('attack-btn').addEventListener('click', () => this.attack());
        document.getElementById('rest-btn').addEventListener('click', () => this.rest());
        document.getElementById('cast-spell-btn').addEventListener('click', () =>
            this.castSpell(document.getElementById('spell-select').value)
        );
        document.getElementById('spell-select').addEventListener('change', () => this.updateSpellDisplay());
        document.getElementById('interact-btn').addEventListener('click', () => this.interact());
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.openSaveSlotPicker('load'));
        document.getElementById('music-toggle').addEventListener('click', event => {
            const enabled = !GameAudio.musicEnabled;
            GameAudio.setMusicEnabled(enabled);
            event.currentTarget.textContent = `Music: ${enabled ? 'On' : 'Off'}`;
            event.currentTarget.setAttribute('aria-pressed', String(enabled));
        });
        document.getElementById('effects-toggle').addEventListener('click', event => {
            const enabled = !GameAudio.effectsEnabled;
            GameAudio.setEffectsEnabled(enabled);
            event.currentTarget.textContent = `Effects: ${enabled ? 'On' : 'Off'}`;
            event.currentTarget.setAttribute('aria-pressed', String(enabled));
        });
        document.getElementById('close-interaction').addEventListener('click', () => {
            document.getElementById('interaction-panel').hidden = true;
        });
        this.canvas.addEventListener('click', event => {
            const bounds = this.canvas.getBoundingClientRect();
            const tileX = this.cameraX +
                Math.floor((event.clientX - bounds.left) * this.viewWidth / bounds.width);
            const tileY = this.cameraY +
                Math.floor((event.clientY - bounds.top) * this.viewHeight / bounds.height);
            const npc = this.npcs.find(candidate =>
                candidate.alive && candidate.x === tileX && candidate.y === tileY
            );
            if (npc) this.openNPCInteraction(npc);
        });
        
        document.getElementById('use-item-btn').addEventListener('click', () => {
            const usableItems = this.player.inventory.filter(item => {
                const itemTemplate = Entities.Items[item.type];
                const effect = itemTemplate?.effect?.();
                return !itemTemplate?.equipmentSlot && !(effect?.mp && this.player.maxMp === 0);
            });
            if (usableItems.length > 0) {
                const itemId = usableItems[Utils.random(0, usableItems.length - 1)].id;
                this.useItem(itemId);
            }
        });

        // Display inventory items when they're added
        const updateInventoryDisplay = () => {
            const list = document.getElementById('inventory-list');
            const btn = document.getElementById('use-item-btn');
            document.getElementById('item-count').textContent = this.player.inventory.length;

            if (this.player.inventory.length === 0) {
                list.innerHTML = '<p style="color:#9ca3af;text-align:center;padding:10px;">No items collected yet</p>';
            } else {
                let html = '';
                this.player.inventory.forEach(item => {
                    const itemTemplate = Entities.Items[item.type];
                    const isEquipment = Boolean(itemTemplate?.equipmentSlot);
                    const itemEffect = itemTemplate?.effect?.();
                    const unavailable = Boolean(itemEffect?.mp && this.player.maxMp === 0);
                    html += `
                        <div class="inventory-item">
                            <span class="inventory-item-name"><span>${item.symbol}</span> ${item.name}</span>
                            <span class="inventory-item-actions">
                                ${isEquipment
                                    ? `<button type="button" data-equip-item="${item.id}">Equip</button>`
                                    : `<button type="button" data-use-item="${item.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? 'No mana' : 'Use'}</button>`}
                            </span>
                        </div>
                    `;
                });
                list.innerHTML = html;
            }
            btn.disabled = !this.player.inventory.some(item => {
                const itemTemplate = Entities.Items[item.type];
                const effect = itemTemplate?.effect?.();
                return !itemTemplate?.equipmentSlot && !(effect?.mp && this.player.maxMp === 0);
            });

            list.querySelectorAll('[data-equip-item]').forEach(button => {
                button.addEventListener('click', () => this.equipItem(button.dataset.equipItem));
            });
            list.querySelectorAll('[data-use-item]').forEach(button => {
                button.addEventListener('click', () => this.useItem(button.dataset.useItem));
            });
            if (document.getElementById('interaction-panel').dataset.type === 'merchant') {
                this.updateTradeDisplay();
            }
        };

        this.updateInventoryDisplay = updateInventoryDisplay;

        this.updateEquipmentDisplay = () => {
            const slots = document.getElementById('equipment-slots');
            const slotLabels = {
                weapon: 'Weapon',
                armor: 'Armor',
                accessory: 'Accessory'
            };
            slots.innerHTML = Object.entries(slotLabels).map(([slot, label]) => {
                const item = this.player.equipment[slot];
                const bonusText = item
                    ? Object.entries(item.bonuses || {})
                        .map(([stat, value]) => `+${value} ${stat === 'goldPerRest' ? 'gold/rest' : stat}`)
                        .join(', ')
                    : 'Empty';
                return `
                    <div class="equipment-slot">
                        <span><strong>${label}:</strong> ${item ? `${item.symbol} ${item.name}` : 'Empty'}
                            ${item ? `<small>${bonusText}</small>` : ''}
                        </span>
                        ${item ? `<button type="button" data-unequip-slot="${slot}">Unequip</button>` : ''}
                    </div>
                `;
            }).join('');

            slots.querySelectorAll('[data-unequip-slot]').forEach(button => {
                button.addEventListener('click', () => this.unequipItem(button.dataset.unequipSlot));
            });
        };

        // Call this function when items are added to inventory
        window.updateInventoryDisplay = () => {
            this.updateInventoryDisplay();
            this.updateEquipmentDisplay();
        };
        
        // Initial call after game initialization
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.updateSpellDisplay();
    },

    updateClassDescription() {
        const classId = document.querySelector('input[name="hero-class"]:checked')?.value;
        const playerClass = Entities.PlayerClasses[classId];
        if (!playerClass) {
            throw new Error(`Unknown hero class: ${classId}`);
        }
        document.getElementById('class-description').textContent = playerClass.description;
        document.getElementById('class-stat-summary').textContent =
            `STR ${playerClass.stats.strength} · MAG ${playerClass.stats.magic} · ` +
            `END ${playerClass.stats.endurance} · AGI ${playerClass.stats.agility} · ` +
            `HP ${playerClass.maxHp} · MP ${playerClass.maxMp}`;
        this.drawClassPreview(classId);
        document.getElementById('review-hero-name').textContent =
            document.getElementById('hero-name').value.trim();
        document.getElementById('review-hero-class').textContent = playerClass.name;
        document.getElementById('review-class-description').textContent = playerClass.description;
        document.getElementById('review-class-stats').textContent =
            document.getElementById('class-stat-summary').textContent;
        const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
        const difficultySettings = this.difficultySettings[difficulty];
        if (!difficultySettings) {
            throw new Error(`Unknown difficulty: ${difficulty}`);
        }
        document.getElementById('review-difficulty').textContent =
            `${difficultySettings.label} — Monsters deal ${Math.round(difficultySettings.monsterDamageMultiplier * 100)}% damage; ` +
            `gold rewards are ${Math.round(difficultySettings.goldMultiplier * 100)}%.`;
    },

    updateStartupAvailability() {
        const loadButton = document.getElementById('load-saved-game');
        const status = document.getElementById('startup-save-status');
        try {
            let hasSave = false;
            for (let slot = 1; slot <= 3; slot++) {
                try {
                    hasSave = Boolean(this.readSaveSlot(slot)?.player) || hasSave;
                } catch (error) {
                    console.error(`Failed to check save slot ${slot}:`, error);
                }
            }
            loadButton.disabled = !hasSave;
            status.textContent = hasSave
                ? 'Choose a saved adventure to continue from any of the three slots.'
                : 'No saved adventure found. Start a new adventure to create your hero.';
        } catch (error) {
            console.error('Failed to check for a saved game:', error);
            loadButton.disabled = true;
            status.textContent = 'Saved games are unavailable because browser storage could not be accessed.';
        }
    },

    readSaveSlot(slot) {
        const stored = localStorage.getItem(this.saveSlotKey(slot)) ??
            (slot === 1 ? localStorage.getItem('rpg_save') : null);
        return stored ? JSON.parse(stored) : null;
    },

    saveSlotKey(slot) {
        return `rpg_save_slot_${slot}`;
    },

    openSaveSlotPicker(mode, returnToStartup = false) {
        this.saveSlotMode = mode;
        this.saveSlotReturnToStartup = returnToStartup;
        document.getElementById('save-slot-title').textContent =
            mode === 'save' ? 'Save Game' : 'Load Game';
        document.getElementById('save-slot-instructions').textContent =
            mode === 'save'
                ? 'Choose a slot. Saving to an occupied slot will ask for confirmation.'
                : 'Choose a saved adventure to continue.';
        this.renderSaveSlots();
        if (returnToStartup) document.getElementById('startup-menu').close();
        document.getElementById('save-slot-dialog').showModal();
    },

    renderSaveSlots() {
        const list = document.getElementById('save-slot-list');
        list.replaceChildren();
        for (let slot = 1; slot <= 3; slot++) {
            const row = document.createElement('div');
            row.className = 'save-slot';
            const details = document.createElement('div');
            details.className = 'save-slot-details';
            const title = document.createElement('strong');
            title.textContent = `Slot ${slot}`;
            const summary = document.createElement('span');
            let saved = null;
            try {
                saved = this.readSaveSlot(slot);
            } catch (error) {
                console.error(`Failed to read save slot ${slot}:`, error);
            }

            if (saved?.player) {
                const playerClass = saved.player.className || 'Adventurer';
                const savedLevel = saved.player.level ?? saved.player._level;
                const level = Number.isFinite(Number(savedLevel)) && Number(savedLevel) > 0
                    ? Number(savedLevel)
                    : 1;
                summary.textContent =
                    `${saved.player.name || 'Unnamed hero'} · ${playerClass} · Level ${level}`;
            } else if (saved) {
                summary.textContent = 'Unreadable save data';
            } else {
                summary.textContent = 'Empty';
            }
            details.append(title, summary);

            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = this.saveSlotMode === 'save' ? 'Save Here' : 'Load';
            button.disabled = this.saveSlotMode === 'load' && !saved?.player;
            button.addEventListener('click', () => {
                if (this.saveSlotMode === 'save') {
                    if (saved && !window.confirm(`Overwrite the saved game in Slot ${slot}?`)) return;
                    if (this.saveGame(slot)) document.getElementById('save-slot-dialog').close();
                } else if (this.loadGame(slot)) {
                    document.getElementById('save-slot-dialog').close();
                }
            });
            row.append(details, button);
            list.append(row);
        }
    },

    drawClassPreview(classId) {
        const preview = document.getElementById('class-preview');
        const ctx = preview.getContext('2d');
        ctx.clearRect(0, 0, preview.width, preview.height);
        SpriteRenderer.drawHeroAppearance(
            { ctx, TILE_SIZE: preview.width },
            classId,
            0,
            0
        );
    },

    advanceCharacterCreation() {
        if (this.characterCreationStep === 0) {
            const nameInput = document.getElementById('hero-name');
            if (!nameInput.value.trim()) {
                nameInput.setCustomValidity('Enter a name for your hero.');
                nameInput.reportValidity();
                return;
            }
            nameInput.setCustomValidity('');
        }
        this.characterCreationStep = Math.min(2, this.characterCreationStep + 1);
        this.renderCharacterCreationStep();
    },

    renderCharacterCreationStep() {
        const steps = [
            document.getElementById('character-step-identity'),
            document.getElementById('character-step-class'),
            document.getElementById('character-step-review')
        ];
        const stepNames = ['Identity', 'Class', 'Review'];
        steps.forEach((step, index) => {
            step.hidden = index !== this.characterCreationStep;
        });
        document.getElementById('creation-progress').textContent =
            `Step ${this.characterCreationStep + 1} of ${steps.length}: ${stepNames[this.characterCreationStep]}`;
        document.getElementById('character-back').hidden = this.characterCreationStep === 0;
        document.getElementById('character-next').hidden = this.characterCreationStep === steps.length - 1;
        document.getElementById('character-submit').hidden = this.characterCreationStep !== steps.length - 1;
        this.updateClassDescription();
        if (this.characterCreationStep === 0) {
            document.getElementById('hero-name').focus();
        } else if (this.characterCreationStep === 1) {
            document.querySelector('input[name="hero-class"]:checked').focus();
        } else {
            document.getElementById('character-step-review').focus();
        }
    },

    startAdventure(name, classId, difficulty = 'medium') {
        if (!Entities.PlayerClasses[classId]) {
            Utils.showMessage('Choose a valid hero class before starting.', 'error');
            return;
        }
        if (!Object.hasOwn(this.difficultySettings, difficulty)) {
            Utils.showMessage('Choose a valid difficulty before starting.', 'error');
            return;
        }
        if (!name) {
            this.characterCreationStep = 0;
            this.renderCharacterCreationStep();
            document.getElementById('hero-name').setCustomValidity('Enter a name for your hero.');
            document.getElementById('hero-name').reportValidity();
            return;
        }
        this.difficulty = difficulty;
        this.updateDifficultyDisplay();
        this.player = new Entities.Player(name, classId);
        this.currentSaveSlot = null;
        QuestSystem.init(this.player, null);
        this.player.updateStatsDisplay();
        this.updateSpellDisplay();
        this.updateCamera();
        window.updateInventoryDisplay();
        this.render();
        document.getElementById('character-creation').close();
    },

    updateSpellDisplay() {
        const select = document.getElementById('spell-select');
        const castButton = document.getElementById('cast-spell-btn');
        const selectedSpell = select.value;
        const availableSpells = Object.entries(Entities.Spells).filter(([id]) =>
            this.player.canCastSpell(id)
        );
        select.innerHTML = availableSpells.map(([id, spell]) =>
            `<option value="${id}">${spell.name} (${spell.manaCost} MP)</option>`
        ).join('');
        if (availableSpells.some(([id]) => id === selectedSpell)) select.value = selectedSpell;

        const spell = Entities.Spells[select.value];
        select.disabled = availableSpells.length === 0;
        castButton.disabled = availableSpells.length === 0;
        const description = availableSpells.length === 0
            ? `${this.player.className} cannot cast spells.`
            : spell
                ? `${spell.description} Cost: ${spell.manaCost} MP${spell.range ? ` · Range: ${spell.range} tiles` : ''}`
                : '';
        document.getElementById('spell-description').textContent = description;
    },

    serializeTerrain() {
        const terrain = [];
        this.map.forEach((row, y) => row.forEach((tile, x) => {
            if (tile) terrain.push([x, y, tile.type]);
        }));
        return terrain;
    },

    // Save game to localStorage
    saveGame(slot) {
        if (slot === undefined) {
            this.openSaveSlotPicker('save');
            return false;
        }
        if (!Number.isInteger(slot) || slot < 1 || slot > 3) {
            Utils.showMessage('Choose a valid save slot.', 'error');
            return false;
        }
        const gameState = {
            player: {
                ...this.player,
                level: this.player.level
            },
            monsters: this.monsters,
            items: this.items,
            npcs: this.npcs,
            terrain: this.serializeTerrain(),
            gold: this.getGold(),
            difficulty: this.difficulty,
            width: this.width,
            height: this.height,
            viewWidth: this.viewWidth,
            viewHeight: this.viewHeight,
            cameraX: this.cameraX,
            cameraY: this.cameraY,
            questData: QuestSystem.serialize()
        };
        
        const saved = Utils.setLocalStorage(this.saveSlotKey(slot), gameState);
        Utils.showMessage(
            saved
                ? `Game saved to Slot ${slot}!`
                : 'Unable to save game. Browser storage may be disabled or full.',
            saved ? 'success' : 'error'
        );
        if (saved) {
            this.currentSaveSlot = slot;
            this.updateStartupAvailability();
            this.renderSaveSlots();
        }
        return saved;
    },

    // Load game from localStorage
    loadGame(slot) {
        if (slot === undefined) {
            this.openSaveSlotPicker('load');
            return false;
        }
        if (!Number.isInteger(slot) || slot < 1 || slot > 3) {
            Utils.showMessage('Choose a valid save slot.', 'error');
            return false;
        }
        let saved;
        try {
            saved = this.readSaveSlot(slot);
        } catch (error) {
            console.error(`Failed to load save slot ${slot}:`, error);
            Utils.showMessage('Unable to load saved game. Browser storage may be unavailable or the save data is invalid.', 'error');
            return false;
        }
        
        if (!saved?.player) {
            Utils.showMessage(`No valid save game found in Slot ${slot}.`, 'error');
            this.updateStartupAvailability();
            return false;
        }
        this.currentSaveSlot = slot;
        this.difficulty = Object.hasOwn(this.difficultySettings, saved.difficulty)
            ? saved.difficulty
            : 'medium';
        this.updateDifficultyDisplay();
        
        this.width = saved.width || 50;
        this.height = saved.height || 30;
        this.viewWidth = saved.viewWidth || 38;
        this.viewHeight = saved.viewHeight || 22;
        this.canvas.width = this.viewWidth * this.TILE_SIZE;
        this.canvas.height = this.viewHeight * this.TILE_SIZE;
        
        this.player = Object.assign(
            Object.create(Entities.Player.prototype),
            saved.player,
            {
                classId: saved.player.classId || null,
                className: saved.player.className || 'Adventurer',
                allowedSpells: saved.player.classId
                    ? [...(Entities.PlayerClasses[saved.player.classId]?.spells || [])]
                    : Object.keys(Entities.Spells),
                equipment: {
                    weapon: saved.player.equipment?.weapon || null,
                    armor: saved.player.equipment?.armor || null,
                    accessory: saved.player.equipment?.accessory || null
                }
            }
        );
        const playerClass = Entities.PlayerClasses[this.player.classId];
        if (playerClass) {
            this.player.maxMp = playerClass.maxMp +
                (this.player.allowedSpells.length > 0 ? Math.max(0, this.player.level - 1) * 10 : 0);
            this.player.mp = this.player.mp;
        }
        this.monsters = saved.monsters;
        this.items = saved.items;
        this.npcs = saved.npcs;
        const savedGold = typeof saved.gold === 'number' || typeof saved.gold === 'string'
            ? Number(saved.gold)
            : NaN;
        if (Number.isFinite(savedGold)) {
            localStorage.setItem('rpg_gold', Math.max(0, Math.floor(savedGold)));
        }
        if (Array.isArray(saved.terrain)) {
            this.map = Array(this.height).fill().map(() => Array(this.width).fill(null));
            saved.terrain.forEach(entry => {
                if (!Array.isArray(entry) || entry.length !== 3) return;
                const [x, y, type] = entry;
                if (Number.isInteger(x) && Number.isInteger(y) &&
                    x >= 0 && x < this.width && y >= 0 && y < this.height &&
                    typeof type === 'string') {
                    this.map[y][x] = { type };
                }
            });
        } else {
            this.map = saved.map ||
                Array(this.height).fill().map(() => Array(this.width).fill(null));
        }
        this.updateCamera();
        
        const questData = saved.questData || (saved.quests ? saved : QuestSystem.getLegacySavedQuestData());
        QuestSystem.init(this.player, questData);
        document.getElementById('interaction-panel').hidden = true;
        this.player.updateStatsDisplay();
        this.updateSpellDisplay();
        window.updateInventoryDisplay();
        this.updateGoldDisplay();
        this.render();
        Utils.showMessage('Game loaded successfully!', 'success');
        this.saveSlotReturnToStartup = false;
        return true;
    },

    // Game over
    gameOver() {
        this.gameState = 'gameover';
        Utils.showMessage(`Game Over! You reached level ${this.player.level}.`, 'error');
        
        // Preserve the loaded slot; new adventures can choose a slot when they die.
        if (this.currentSaveSlot) this.saveGame(this.currentSaveSlot);
        else this.openSaveSlotPicker('save');
    }
};

// Helper function to get random monster type
function getRandomMonster() {
    const types = ['slime', 'goblin', 'orc', 'wolf', 'skeleton'];
    return types[Utils.random(0, types.length - 1)];
}

function getRandomEquipmentType() {
    const types = [
        'sword', 'shield', 'leatherArmor', 'chainmail',
        'goldRing', 'silverRing', 'luckyCharm'
    ];
    return types[Utils.random(0, types.length - 1)];
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
