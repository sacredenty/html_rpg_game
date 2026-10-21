/**
 * Player - Handles player entity with all abilities, equipment, and stats
 */

import Utils from '../utils/helpers.js';

class Player {
    constructor(name, classId = 'warrior') {
        // Get or create base class
        const BaseClass = this.getBasePlayerClass(classId);
        
        if (!name) name = 'Hero';
        
        // Initialize with base class
        Object.assign(this, new BaseClass(name, classId));
        
        // Bind methods to preserve 'this'
        this.attack = this.attack.bind(this);
        this.castSpell = this.castSpell.bind(this);
    }

    /**
     * Get or create player base class
     */
    getBasePlayerClass(classId) {
        const baseClasses = [
            { id: 'warrior', name: 'Warrior' },
            { id: 'mage', name: 'Mage' },
            { id: 'ranger', name: 'Ranger' }
        ];
        
        const selected = baseClasses.find(c => c.id === classId) || baseClasses[0];
        return Player.BaseClasses[selected.id];
    }

    /**
     * Attack action
     */
    attack(target, damageMultiplier = 1) {
        if (!target || target.hp <= 0) return false;
        
        // Calculate weapon damage
        let weaponDamage = this.weapon ? this.weapon.damage : this.stats.strength;
        
        // Apply equipment bonus
        const equipmentBonus = Object.values(this.equipment || {}).reduce(
            (total, item) => total + (item?.bonuses?.damage || 0),
            0
        );
        
        weaponDamage += equipmentBonus;
        
        // Calculate final damage
        const damage = Math.floor(weaponDamage * damageMultiplier);
        target.takeDamage(damage);
        
        return damage;
    }

    /**
     * Cast a spell if player has the class and resources
     */
    castSpell(spellId) {
        if (!this.allowedSpells.includes(spellId)) {
            console.log(`[Player] Cannot cast ${spellId}: Not learned`);
            return false;
        }
        
        const spell = SpellRegistry.getSpell(spellId);
        if (spell && this.mp >= spell.cost) {
            this.mp -= spell.cost;
            
            // Trigger spell effect
            SpellEffects.execute(spell.effect, this, spell.target || null);
            
            return true;
        }
        
        console.log(`[Player] Cannot cast ${spellId}: Insufficient MP`);
        return false;
    }

    /**
     * Use an item from inventory
     */
    useItem(itemType) {
        const itemIndex = this.inventory.findIndex(i => i.type === itemType);
        
        if (itemIndex > -1) {
            const item = this.inventory[itemIndex];
            
            // Remove consumed items or move them to equipment
            if (item.consumable) {
                this.inventory.splice(itemIndex, 1);
                item.consume(this);
            } else if (item.equippable && !this.equipment[this.getEquipmentSlotForItem(item)]) {
                const slot = this.getEquipmentSlotForItem(item);
                const currentItem = this.equipment[slot];
                
                if (currentItem) {
                    // Return previous item to inventory
                    this.inventory.push(currentItem);
                }
                
                this.equipment[slot] = item;
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Get equipment slot for an item type
     */
    getEquipmentSlotForItem(item) {
        const typeMap = {
            weapon: 'weapon',
            armor: 'armor',
            accessory: 'accessory'
        };
        return typeMap[item.type] || null;
    }

    /**
     * Gain experience points
     */
    gainXp(amount) {
        this.xp += amount;
        
        // Level up check
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    /**
     * Level up
     */
    levelUp() {
        const prevLevel = this.level;
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        
        // Stat increases based on class
        const baseStats = this.getBasePlayerClass(this.classId).stats;
        const statBonuses = {
            strength: baseStats.strength,
            magic: baseStats.magic,
            endurance: baseStats.endurance,
            agility: baseStats.agility
        };
        
        // Increase stats by a small percentage
        ['strength', 'magic', 'endurance', 'agility'].forEach(stat => {
            this.stats[stat] = Math.floor(this.stats[stat] * 1.1);
        });
        
        console.log(`[Player] Level up! ${prevLevel} -> ${this.level}`);
    }

    /**
     * Take damage (with durability considerations)
     */
    takeDamage(amount) {
        const actualDamage = this.hasArmor ? amount - 1 : amount; // Simplified armor reduction
        this.hp -= actualDamage;
        
        // Reset durability
        this.armorDurability = Math.max(0, this.armorDurability - 5);
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.dying();
        }
    }

    /**
     * Heal player
     */
    heal(amount, maxAmount = null) {
        const actualMax = maxAmount ?? this.maxHp;
        this.hp = Math.min(this.hp + amount, actualMax);
        
        // Reset durability on full heal if at 100% HP
        if (this.hp === actualMax && !amount) {
            this.armorDurability = Math.min(this.armorDurability || 0, 100);
        }
    }

    /**
     * Die
     */
    dying() {
        this.dyingState = true;
        
        // Quest systems can hook into player death
        GameSystem?.onPlayerDeath?.(this);
        
        console.log(`[Player] ${this.name} is dying!`);
    }

    /**
     * Revive (resurrection)
     */
    revive() {
        if (!this.dyingState) return false;
        
        this.hp = Math.floor(this.maxHp / 2); // 50% HP on resurrection
        this.armorDurability = Math.min(this.armorDurability || 0, 100);
        this.dyingState = false;
        
        console.log(`[Player] ${this.name} has been revived!`);
        return true;
    }

    /**
     * Update HUD display (via DOM)
     */
    updateStatsDisplay() {
        if (typeof window !== 'undefined' && document.getElementById('level-display')) {
            document.getElementById('level-display').textContent = this.level;
            document.getElementById('hp-display').textContent = `${this.hp}/${this.maxHp}`;
            document.getElementById('mp-display').textContent = `${this.mp}/${this.maxMp}`;
        }
    }

    /**
     * Add an item to inventory
     */
    addItem(item) {
        this.inventory.push(item);
    }

    /**
     * Remove item from inventory by index or type
     */
    removeItem(indexOrType) {
        if (typeof indexOrType === 'number') {
            return this.inventory.splice(indexOrType, 1)[0];
        } else {
            const index = this.inventory.findIndex(i => i.type === indexOrType);
            if (index > -1) {
                return this.inventory.splice(index, 1)[0];
            }
        }
        return null;
    }

    /**
     * Get player stats summary
     */
    getStats() {
        return {
            name: this.name,
            level: this.level,
            classId: this.classId,
            className: this.className,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            stats: { ...this.stats },
            inventory: [...this.inventory],
            equipment: { ...this.equipment }
        };
    }

    /**
     * Save player state for serialization
     */
    toJSON() {
        return this.getStats();
    }
}

/**
 * Base Player Classes (mirroring entities.js)
 */
Player.BaseClasses = {
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
};

export default Player;
