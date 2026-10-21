/**
 * SpriteAtlas - Handles sprite data and rendering definitions
 */

const SpriteAtlas = {
    /**
     * Sprite definitions (tile-based emoji/sprite system)
     */
    sprites: {
        // Terrain symbols
        terrain: {
            grass: '#2d5016',
            dirt: '#8b5a2b',
            sand: '#deb887',
            snow: '#e8f4f8',
            water: '#0284c7'
        },

        // Entity emblems (using Unicode emoji)
        entities: {
            hero_default: '🧑‍🦱',
            hero_warrior: '⚔️',
            hero_mage: '🧙‍♂️',
            hero_ranger: '🏹'
        },

        // Monster types
        monsters: {
            slime: '💚',
            goblin: '👺',
            wolf: '🐺',
            orc: '👹',
            skeleton: '💀',
            dragon: '🐉'
        },

        // NPC types  
        npcs: {
            villager: '👤',
            king: '👑',
            merchant: '💰'
        }
    },

    /**
     * Get sprite for a given type
     */
    getSprite(type) {
        const sprites = {
            terrain: this.sprites.terrain,
            entities: this.sprites.entities,
            monsters: this.sprites.monsters,
            npcs: this.sprites.npcs
        };

        if (sprites.hasOwnProperty(type)) {
            return this.sprites[type];
        }
        
        // Default fallback
        return '👤';
    },

    /**
     * Get terrain sprite by type
     */
    getTerrainSprite(tileType) {
        const tiles = Object.keys(this.sprites.terrain);
        
        if (tileType === 'river' || tileType === 'lake') {
            return '#0284c7';
        } else if (tileType === 'mountain') {
            return '⛰️';
        } else if (tiles.includes(tileType)) {
            return this.sprites.terrain[tileType];
        }
        
        return this.sprites.terrain.grass; // Default grass
    },

    /**
     * Get monster sprite by name/type
     */
    getMonsterSprite(monsterName) {
        const monsters = Object.keys(this.sprites.monsters);
        
        if (monsters.includes(monsterName)) {
            return this.sprites.monsters[monsterName];
        }
        
        // Default to slime for unknown monsters
        return this.sprites.monsters.slime;
    },

    /**
     * Get NPC sprite by type
     */
    getNPCSprite(npcType) {
        const npcs = Object.keys(this.sprites.npcs);
        
        if (npcs.includes(npcType)) {
            return this.sprites.npcs[npcType];
        }
        
        return this.sprites.npcs.villager; // Default villager
    },

    /**
     * Get hero sprite based on class/weapon
     */
    getHeroSprite(player) {
        const heroes = Object.keys(this.sprites.entities);
        
        if (player?.classId === 'mage') {
            return this.sprites.entities.hero_mage;
        } else if (player?.classId === 'ranger') {
            return this.sprites.entities.hero_ranger;
        } else if (player?.equipment?.weapon) {
            // Check for epic weapon indicator
            const weaponName = player.equipment.weapon.name || '';
            if (weaponName.toLowerCase().includes('legendary')) {
                return '🗡️'; // Legendary sword
            }
        }
        
        return this.sprites.entities.hero_default;
    },

    /**
     * Clear all sprite definitions (for game over/reset)
     */
    clearSprites() {
        Object.keys(this.sprites).forEach(key => {
            delete this.sprites[key];
        });
    }
};

export default SpriteAtlas;
