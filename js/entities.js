// Game Entities - Player, Monsters, Items, etc.

const Entities = {
    PlayerClasses: {
        warrior: {
            name: 'Warrior',
            description: 'A stalwart fighter with high strength and endurance. Warriors do not use magic.',
            stats: { strength: 14, magic: 6, endurance: 14, agility: 8 },
            maxHp: 130,
            maxMp: 0,
            spells: []
        },
        mage: {
            name: 'Mage',
            description: 'A gifted spellcaster with powerful magic and a deep reserve of mana, but less health. Mages can learn every spell.',
            stats: { strength: 6, magic: 15, endurance: 8, agility: 10 },
            maxHp: 85,
            maxMp: 90,
            spells: ['arcaneBolt', 'flameBurst', 'healingLight']
        },
        ranger: {
            name: 'Ranger',
            description: 'A versatile explorer with balanced strength and magic, plus the highest agility. Rangers can cast Healing Light.',
            stats: { strength: 11, magic: 8, endurance: 10, agility: 14 },
            maxHp: 105,
            maxMp: 25,
            spells: ['healingLight']
        }
    },

    // Player Class
    Player: class {
        constructor(name, classId = 'warrior') {
            const playerClass = Entities.PlayerClasses[classId] || Entities.PlayerClasses.warrior;
            this.name = name || 'Hero';
            this.classId = Entities.PlayerClasses[classId] ? classId : 'warrior';
            this.className = playerClass.name;
            this.allowedSpells = [...playerClass.spells];
            this.x = 10;
            this.y = 10;
            
            // Base stats (can be increased with equipment/skills)
            this.stats = { ...playerClass.stats };

            // Health and Mana
            this.maxHp = playerClass.maxHp;
            this.hp = this.maxHp;
            this.maxMp = playerClass.maxMp;
            this.mp = this.maxMp;

            // Level and experience
            this.level = 1;
            this.xp = 0;
            this.xpToNextLevel = 100;

            // Inventory
            this.inventory = [];
            
            // Equipment slots
            this.equipment = {
                weapon: null,
                armor: null,
                accessory: null
            };

            // Quests tracking
            this.quests = {};

            // Flags
            this.hasMetKing = false;
            this.hasDefeatedDragon = false;
        }

        get level() { return this._level; }
        set level(val) { 
            this._level = val;
            document.getElementById('level-display').textContent = val;
        }

        get hp() { return this._hp; }
        set hp(val) { 
            this._hp = Utils.clamp(val, 0, this.maxHp);
            document.getElementById('hp-display').textContent = `${this.hp}/${this.maxHp}`;
        }

        get mp() { return this._mp; }
        set mp(val) { 
            this._mp = Utils.clamp(val, 0, this.maxMp);
            document.getElementById('mp-display').textContent = `${this.mp}/${this.maxMp}`;
        }

        getEquipmentBonus(stat) {
            return Object.values(this.equipment || {}).reduce(
                (total, item) => total + (item?.bonuses?.[stat] || 0),
                0
            );
        }

        canCastSpell(spellId) {
            if (!this.classId) return true;
            const playerClass = Entities.PlayerClasses[this.classId];
            return Boolean(playerClass?.spells.includes(spellId));
        }

        gainXp(amount) {
            this.xp += amount;
            let levelsGained = 0;
            while (this.xp >= this.xpToNextLevel) {
                this.levelUp();
                levelsGained++;
            }
            this.updateStatsDisplay();
            if (levelsGained > 0) {
                const levelText = levelsGained === 1 ? 'level' : 'levels';
                Utils.showMessage(`Level up! You gained ${levelsGained} ${levelText} and reached level ${this.level}!`, 'success');
            }
            return levelsGained;
        }

        levelUp() {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);

            // Increase stats
            this.stats.strength += 2;
            this.stats.magic += 2;
            this.stats.endurance += 1;
            this.stats.agility += 1;

            // Increase max HP and MP
            this.maxHp += 20;
            if (this.allowedSpells.length > 0) this.maxMp += 10;

            // Restore the expanded health and mana pools on level up
            this.hp = this.maxHp;
            this.mp = this.maxMp;
        }

        addInventoryItem(item) {
            this.inventory.push(item);
            document.getElementById('item-count').textContent = this.inventory.length;
            // Notify game to update inventory display
            if (typeof window.updateInventoryDisplay === 'function') {
                window.updateInventoryDisplay();
            }
        }

        removeInventoryItem(itemId) {
            const index = this.inventory.findIndex(i => i.id === itemId);
            if (index !== -1) {
                this.inventory.splice(index, 1);
                document.getElementById('item-count').textContent = this.inventory.length;
                return true;
            }
            return false;
        }

        updateStatsDisplay() {
            const s = this.stats;
            const strength = s.strength + this.getEquipmentBonus('strength');
            document.getElementById('player-name').textContent =
                `${this.name} · ${this.className || 'Adventurer'}`;
            document.getElementById('level-display').textContent = this.level;
            document.getElementById('hp-display').textContent = `${this.hp}/${this.maxHp}`;
            document.getElementById('mp-display').textContent = `${this.mp}/${this.maxMp}`;
            document.getElementById('strength-val').textContent = strength;
            document.getElementById('magic-val').textContent = s.magic;
            document.getElementById('endurance-val').textContent = s.endurance;

            const strengthBar = document.getElementById('strength-bar');
            const magicBar = document.getElementById('magic-bar');
            const enduranceBar = document.getElementById('endurance-bar');

            // Scale bars to max level 20 for visual representation
            const scale = 20;
            strengthBar.value = Math.min(strength * scale, 100);
            magicBar.value = Math.min(s.magic * scale, 100);
            enduranceBar.value = Math.min(s.endurance * scale, 100);
            this.updateExperienceDisplay();
        }

        updateExperienceDisplay() {
            const xpDisplay = document.getElementById('xp-display');
            const xpBar = document.getElementById('xp-bar');
            xpDisplay.textContent = `${this.xp}/${this.xpToNextLevel} XP`;
            xpBar.max = this.xpToNextLevel;
            xpBar.value = this.xp;
        }

        // Legacy methods kept for compatibility - new quest system handles this

        checkFlags(flag, value) {
            const current = this[`has${flag}`];
            if (current !== value) {
                this[`has${flag}`] = value;
                return true;
            }
            return false;
        }
    },

    // Monster Types
    Monsters: {
        slime: {
            name: 'Slime',
            hp: 30,
            maxHp: 30,
            attack: 3,
            defense: 1,
            xp: 20,
            gold: 5,
            symbol: '🟢',
            color: '#4ade80',
            size: 0.6
        },
        goblin: {
            name: 'Goblin',
            hp: 50,
            maxHp: 50,
            attack: 6,
            defense: 2,
            xp: 35,
            gold: 10,
            symbol: '👺',
            color: '#fbbf24',
            size: 0.7
        },
        orc: {
            name: 'Orc Warrior',
            hp: 80,
            maxHp: 80,
            attack: 10,
            defense: 4,
            xp: 60,
            gold: 20,
            symbol: '👹',
            color: '#ef4444',
            size: 0.8
        },
        wolf: {
            name: 'Wolf',
            hp: 40,
            maxHp: 40,
            attack: 7,
            defense: 2,
            xp: 30,
            gold: 8,
            symbol: '🐺',
            color: '#e5e7eb',
            size: 0.6
        },
        dragon: {
            name: 'Dragon',
            hp: 300,
            maxHp: 300,
            attack: 25,
            defense: 15,
            xp: 500,
            gold: 500,
            symbol: '🐉',
            color: '#a855f7',
            size: 1.2
        },
        skeleton: {
            name: 'Skeleton',
            hp: 45,
            maxHp: 45,
            attack: 8,
            defense: 3,
            xp: 40,
            gold: 12,
            symbol: '💀',
            color: '#9ca3af',
            size: 0.7
        }
    },

    // Create monster instance
    createMonster: (type, x, y) => {
        const template = Entities.Monsters[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            x: x,
            y: y,
            hp: template.hp,
            maxHp: template.maxHp,
            attack: template.attack,
            defense: template.defense,
            xp: template.xp,
            gold: template.gold,
            symbol: template.symbol,
            color: template.color,
            size: template.size,
            alive: true
        };
    },

    // Item Types
    Items: {
        healthPotion: {
            name: 'Health Potion',
            description: 'Restores 30 HP',
            effect: () => ({ hp: 30 }),
            symbol: '🧪',
            color: '#ef4444'
        },
        healingHerb: {
            name: 'Healing Herb',
            description: 'Restores 10 HP',
            effect: () => ({ hp: 10 }),
            symbol: '🌿',
            color: '#22c55e'
        },
        manaPotion: {
            name: 'Mana Potion',
            description: 'Restores 25 MP',
            effect: () => ({ mp: 25 }),
            symbol: '💜',
            color: '#8b5cf6'
        },
        sword: {
            name: 'Iron Sword',
            description: '+3 Strength',
            effect: () => ({ strength: 3 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 3 },
            symbol: '⚔️',
            color: '#fbbf24'
        },
        legendarySword: {
            name: 'Legendary Sword',
            description: '+8 Strength',
            effect: () => ({ strength: 8 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 8 },
            symbol: '🗡️',
            color: '#fef08a'
        },
        shield: {
            name: 'Wooden Shield',
            description: '+2 Defense',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 2 },
            symbol: '🛡️',
            color: '#9ca3af'
        },
        leatherArmor: {
            name: 'Leather Armor',
            description: '+2 Defense',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 2 },
            symbol: '🥋',
            color: '#a16207'
        },
        chainmail: {
            name: 'Chainmail',
            description: '+4 Defense',
            effect: () => ({ defense: 4 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 4 },
            symbol: '⛓️',
            color: '#94a3b8'
        },
        goldRing: {
            name: 'Gold Ring',
            description: '+5 Gold when resting',
            effect: () => ({ goldPerRest: 5 }),
            equipmentSlot: 'accessory',
            bonuses: { goldPerRest: 5 },
            symbol: '💍',
            color: '#fbbf24'
        },
        silverRing: {
            name: 'Silver Ring',
            description: '+10 Gold when resting',
            effect: () => ({ goldPerRest: 10 }),
            equipmentSlot: 'accessory',
            bonuses: { goldPerRest: 10 },
            symbol: '💍',
            color: '#cbd5e1'
        },
        luckyCharm: {
            name: 'Lucky Charm',
            description: '+2 Strength',
            effect: () => ({ strength: 2 }),
            equipmentSlot: 'accessory',
            bonuses: { strength: 2 },
            symbol: '🍀',
            color: '#4ade80'
        }
    },

    // Create item instance
    createItem: (type, x, y) => {
        const template = Entities.Items[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            description: template.description,
            effect: template.effect,
            equipmentSlot: template.equipmentSlot || null,
            bonuses: template.bonuses || {},
            symbol: template.symbol,
            color: template.color,
            x: x,
            y: y,
            alive: true
        };
    },

    // NPC Types
    NPCs: {
        villager: {
            name: 'Villager',
            dialogue: "Hello traveler! Welcome to this land.",
            questGiver: false
        },
        king: {
            name: 'King Alaric',
            dialogue: "My people need your help, brave hero!",
            questGiver: true,
            mainQuest: true
        },
        merchant: {
            name: 'Merchant',
            dialogue: "Items for sale! Check my wares!",
            questGiver: false,
            hasShop: true
        }
    },

    // Create NPC instance
    createNPC: (type, x, y) => {
        const template = Entities.NPCs[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            dialogue: template.dialogue,
            questGiver: template.questGiver,
            mainQuest: template.mainQuest,
            hasShop: template.hasShop,
            x: x,
            y: y,
            alive: true
        };
    },

    // Spells available to the player
    Spells: {
        arcaneBolt: {
            name: 'Arcane Bolt',
            description: 'Deal magic-based damage to a nearby enemy.',
            manaCost: 8,
            power: 2,
            range: 6,
            type: 'damage',
            color: '#a78bfa'
        },
        flameBurst: {
            name: 'Flame Burst',
            description: 'Deal heavy magic-based damage to a nearby enemy.',
            manaCost: 16,
            power: 3,
            range: 4,
            type: 'damage',
            color: '#fb923c'
        },
        healingLight: {
            name: 'Healing Light',
            description: 'Restore HP based on your Magic stat.',
            manaCost: 12,
            type: 'heal',
            baseHealing: 20,
            healingPerMagic: 2,
            color: '#34d399'
        }
    },

    // Tile Biomes
    Biomes: {
        forest: 'forest',
        mountain: 'mountain',
        desert: 'desert',
        dungeon: 'dungeon'
    }
};
