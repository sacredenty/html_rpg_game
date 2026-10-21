/**
 * WorldGenerator - Handles world terrain generation and entity spawning
 */

import Utils from '../utils/helpers.js';

const WorldGenerator = {
    /**
     * Generate terrain for the entire map
     */
    generateTerrain(width, height) {
        const map = Array(height).fill().map(() => Array(width).fill(null));
        
        // Create river through middle of map
        this.createRivers(map);
        
        // Create bridge crossing rivers
        this.createBridges(map);
        
        // Add mountains in upper-right area
        this.addMountains(map);
        
        // Generate random items and monsters
        this.generateEntities(map);
        
        return map;
    },

    /**
     * Create river winding through the world
     */
    createRivers(map) {
        const riverWidth = 2;
        const centerY = Math.floor(map.length / 2);
        
        // Sine wave pattern for natural river curve
        for (let y = centerY - 3; y <= centerY + 3; y++) {
            if (y < 0 || y >= map.length) continue;
            
            const centerX = Math.floor(map[0].length / 2);
            const riverOffset = Math.sin((y - centerY) * 0.45) * 2;
            const riverX1 = centerX + riverOffset;
            const riverX2 = centerX + riverOffset + 1;
            
            // Only place river within map bounds
            for (let x = Math.max(0, riverX1); x < Math.min(map[0].length, riverX2 + 1); x++) {
                if (x >= 0 && x < map[0].length) {
                    map[y][x] = { type: 'river' };
                }
            }
        }
    },

    /**
     * Create bridge tiles crossing the river
     */
    createBridges(map) {
        const centerY = Math.floor(map.length / 2);
        
        for (let x = map[0].length - 3; x >= map[0].length - 5; x--) {
            if (x < 0 || y >= 0 && y <= map.length) continue;
            
            // Check if river exists at this column
            const hasRiverAtCenter = centerY > -1 && centerY < map.length && 
                                     map[centerY]?.[x]?.type === 'river';
            
            if (hasRiverAtCenter) {
                for (let y = centerY - 1; y <= centerY + 1; y++) {
                    if (y >= 0 && y < map.length) {
                        // Check if tile is empty or needs bridge
                        if (!map[y][x] || map[y][x].type === 'river') {
                            map[y][x] = { type: 'bridge' };
                        }
                    }
                }
            }
        }
    },

    /**
     * Add mountains to the upper-right region
     */
    addMountains(map) {
        const mountainRegion = [
            [28, 13], [29, 13], [30, 13], [31, 13], [32, 13], [33, 13], [34, 13],
            [27, 14], [28, 14], [29, 14], [30, 14], [31, 14], [32, 14], [33, 14], [34, 14],
            [26, 15], [27, 15], [28, 15], [29, 15], [30, 15], [31, 15], [32, 15], [33, 15],
            [28, 16], [29, 16], [30, 16], [31, 16], [32, 16], [33, 16]
        ];

        mountainRegion.forEach(([x, y]) => {
            if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
                map[y][x] = { type: 'mountain' };
            }
        });
    },

    /**
     * Generate random entities (items and monsters) for the world
     */
    generateEntities(map) {
        const spawnRate = 0.18; // ~18% chance per tile to have something
        
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                const rand = Math.random();
                
                // Don't spawn on mountains or water/bridge
                if (map[y][x]?.type === 'mountain') continue;
                if (map[y][x]?.type?.includes('river')) continue;
                
                if (rand < spawnRate) {
                    const spawnType = Utils.random(1, 5); // 1-5: different entities
                    
                    switch(spawnType) {
                        case 1:
                            // Add slime in starting area
                            if (x < 20 && y < 12) {
                                this.spawnMonster('slime', x, y);
                            }
                            break;
                            
                        case 2:
                            // Add goblin in middle area
                            if (x >= 20 && x < 38) {
                                this.spawnMonster('goblin', x, y);
                            }
                            break;
                            
                        case 3:
                            // Add wolf in mountain area
                            if (x >= 38 && map[y][x]?.type !== 'mountain') {
                                this.spawnMonster('wolf', x, y);
                            }
                            break;
                            
                        case 4:
                            // Add orc in lower-left dungeon area
                            if (y >= map.length / 2) {
                                this.spawnMonster('orc', x, y);
                            }
                            break;
                                
                        case 5:
                            // Random equipment item
                            const items = ['healthPotion', 'healingHerb', 'sword', 'shield'];
                            const randomItem = Utils.random(0, items.length);
                            this.spawnItem(items[randomItem], x, y);
                            break;
                    }
                }
            }
        }
    },

    /**
     * Spawn a monster at position (checks for free tile)
     */
    spawnMonster(monsterType, x, y) {
        const monster = {
            type: monsterType,
            name: monsterType === 'slime' ? 'Slime' : 
                   monsterType === 'goblin' ? 'Goblin' :
                   monsterType === 'wolf' ? 'Wolf' :
                   monsterType === 'orc' ? 'Orc' :
                   monsterType === 'skeleton' ? 'Skeleton' :
                   monsterType === 'dragon' ? 'Dragon' : 'Slime',
            x,
            y,
            alive: true,
            hp: this.getMonsterHP(monsterType),
            damage: this.getMonsterDamage(monsterType)
        };

        return monster;
    },

    /**
     * Spawn an item at position (checks for free tile)
     */
    spawnItem(itemType, x, y) {
        const item = {
            type: itemType,
            name: this.getItemName(itemType),
            x,
            y,
            alive: true,
            consumable: itemType === 'healthPotion' || itemType === 'healingHerb'
        };

        return item;
    },

    /**
     * Get appropriate HP for a monster type
     */
    getMonsterHP(type) {
        const hpMap = {
            slime: 30,
            goblin: 40,
            wolf: 50,
            orc: 80,
            skeleton: 35,
            dragon: 500
        };

        return hpMap[type] || hpMap.slime;
    },

    /**
     * Get appropriate damage for a monster type
     */
    getMonsterDamage(type) {
        const dmgMap = {
            slime: 5,
            goblin: 8,
            wolf: 12,
            orc: 15,
            skeleton: 10,
            dragon: 30
        };

        return dmgMap[type] || dmgMap.slime;
    },

    /**
     * Get display name for an item type
     */
    getItemName(type) {
        const names = {
            healthPotion: 'Health Potion',
            healingHerb: 'Healing Herb',
            sword: 'Iron Sword',
            shield: 'Wooden Shield'
        };

        return names[type] || type;
    },

    /**
     * Create initial world with specified dimensions
     */
    createWorld(width = 50, height = 30) {
        // Generate terrain first
        const map = this.generateTerrain(width, height);
        
        return {
            map,
            width,
            height
        };
    }
};

export default WorldGenerator;
