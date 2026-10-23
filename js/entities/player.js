// Player
Object.assign(Entities, {
    PlayerClasses: {
        warrior: {
            name: 'Warrior',
            description: 'A stalwart fighter with high strength and endurance. Warriors do not use magic.',
            stats: { strength: 14, magic: 6, endurance: 14, agility: 8 },
            maxHp: 130,
            maxMp: 0,
            spells: [],
            abilities: [
                { name: 'Shield Bash', description: 'Deal bonus damage and knockback when attacking with shield equipped (Level 5)', level: 5, type: 'damage' },
                { name: 'Battle Cry', description: 'Temporarily boost strength for allies in area (Level 10)', level: 10, type: 'buff' }
            ]
        },
        mage: {
            name: 'Mage',
            description: 'A gifted spellcaster with powerful magic and a deep reserve of mana, but less health. Mages can learn every spell.',
            stats: { strength: 6, magic: 15, endurance: 8, agility: 10 },
            maxHp: 85,
            maxMp: 90,
            spells: ['arcaneBolt', 'flameBurst', 'healingLight'],
            abilities: [
                { name: 'Mana Shield', description: 'Convert a portion of damage taken to MP (Level 5)', level: 5, type: 'defense' },
                { name: 'Arcane Mastery', description: 'Increase spell damage by 20% (Level 10)', level: 10, type: 'buff' }
            ]
        },
        ranger: {
            name: 'Ranger',
            description: 'A versatile explorer with balanced strength and magic, plus the highest agility. Rangers can cast Healing Light.',
            stats: { strength: 11, magic: 8, endurance: 10, agility: 14 },
            maxHp: 105,
            maxMp: 25,
            spells: ['healingLight'],
            abilities: [
                { name: 'Hunter\'s Instinct', description: 'Bonus damage against weak enemies (Level 5)', level: 5, type: 'damage' },
                { name: 'Stealth', description: 'Move undetected in forests for invisibility (Level 10)', level: 10, type: 'utility' }
            ]
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

        // Check if player has access to a class ability at current level
        hasAbility(abilityName) {
            const playerClass = Entities.PlayerClasses[this.classId];
            if (!playerClass || !playerClass.abilities) return false;
            
            const ability = playerClass.abilities.find(a => a.name === abilityName);
            return ability && this.level >= ability.level;
        }

        // Get abilities available for current class and level
        getAvailableAbilities() {
            const playerClass = Entities.PlayerClasses[this.classId];
            if (!playerClass || !playerClass.abilities) return [];
            
            return playerClass.abilities.filter(ability => this.level >= ability.level);
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
            // Update abilities when stats change (e.g. for class-specific buffs)
            if (typeof window.updateAbilitiesDisplay === 'function') {
                window.updateAbilitiesDisplay();
            }
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

});
