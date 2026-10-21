/**
 * Monster - Base monster class with AI behaviors
 */

class Monster {
    constructor(type, x, y) {
        const typeData = this.getTypeData(type);
        
        if (!typeData) {
            console.warn(`[Monster] Unknown monster type: ${type}`);
            return;
        }
        
        // Initialize with default values
        this.type = type;
        this.x = x;
        this.y = y;
        this.name = typeData.name;
        this.hp = typeData.hp;
        this.maxHp = typeData.hp;
        this.armor = 0;
        this.dmgMod = 1;
        this.expValue = typeData.xp || 50;
        this.goldValue = typeData.gold || 10;
        this.alive = true;
        this.aggro = false;
        
        // AI properties
        this.aiState = 'idle'; // idle, chase, attack, flee
        this.lastAttackTime = Date.now();
        this.attackCooldown = typeData.attackSpeed || 2000; // ms
        
        // Bind methods
        this.takeDamage = this.takeDamage.bind(this);
        this.updateAI = this.updateAI.bind(this);
    }

    /**
     * Get monster type data (from entities.js structure)
     */
    getTypeData(type) {
        const monsters = {
            slime: {
                name: 'Slime',
                hp: 30,
                maxHp: 30,
                damage: 5,
                armor: 0,
                xp: 20,
                gold: 5
            },
            goblin: {
                name: 'Goblin',
                hp: 40,
                maxHp: 40,
                damage: 8,
                armor: 1,
                xp: 40,
                gold: 15
            },
            wolf: {
                name: 'Wolf',
                hp: 50,
                maxHp: 50,
                damage: 12,
                armor: 2,
                xp: 60,
                gold: 20
            },
            orc: {
                name: 'Orc',
                hp: 80,
                maxHp: 80,
                damage: 15,
                armor: 3,
                xp: 100,
                gold: 35
            },
            skeleton: {
                name: 'Skeleton',
                hp: 35,
                maxHp: 35,
                damage: 10,
                armor: 1,
                xp: 50,
                gold: 20
            },
            dragon: {
                name: 'Dragon',
                hp: 500,
                maxHp: 500,
                damage: 30,
                armor: 15,
                xp: 1000,
                gold: 500
            }
        };
        
        return monsters[type] || monsters.slime;
    }

    /**
     * AI update loop for intelligent behavior
     */
    updateAI(targetPlayer) {
        if (!this.alive || !targetPlayer) {
            this.aiState = 'idle';
            return;
        }

        const now = Date.now();

        // Check if we should attack (cooldown check)
        if (now - this.lastAttackTime > this.attackCooldown) {
            // Calculate distance to player
            const dx = targetPlayer.x - this.x;
            const dy = targetPlayer.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 1.5 && targetPlayer.hp > 0) {
                this.aiState = 'attack';
                this.attack(targetPlayer);
            } else {
                // Move towards player if aggro or close
                const moveX = Math.sign(dx);
                const moveY = Math.sign(dy);

                // Try to move (simplified pathfinding)
                if (!GameSystem?.isTileBlocked(this.x + moveX, this.y + moveY)) {
                    this.x += moveX;
                } else if (!GameSystem?.isTileBlocked(this.x, this.y + moveY)) {
                    this.y += moveY;
                }

                // Set aggro if player is nearby and we haven't attacked yet
                if (distance <= 1.5 && !this.aggro) {
                    this.aggro = true;
                }

                if (distance > 2) {
                    this.aiState = 'chase';
                } else {
                    this.aiState = 'attack';
                }
            }

            this.lastAttackTime = now;
        }
    }

    /**
     * Attack a target entity
     */
    attack(target) {
        if (!target || target.hp <= 0) return 0;

        // Simplified weapon damage model
        const damage = Math.max(1, this.damage * (0.8 + Math.random() * 0.4)); // 80-120% variance

        target.takeDamage(damage);
        console.log(`[Monster] ${this.name} attacks for ${Math.floor(damage)} damage!`);

        return Math.floor(damage);
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        // Simplified armor reduction
        let actualDamage = amount - (this.armor > 0 ? this.armor / 2 : 0);
        actualDamage = Math.max(1, actualDamage);

        this.hp -= actualDamage;

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            
            // Handle monster death (quest updates, rewards, etc.)
            GameSystem?.onMonsterDeath?.(this);
            
            console.log(`[Monster] ${this.name} defeated!`);
        } else {
            // Visual feedback for taking damage could be added here
        }
    }

    /**
     * Revive monster (for AI that respawns)
     */
    revive() {
        if (this.alive) return false;

        this.hp = Math.floor(this.maxHp / 2); // 50% HP on revival
        this.x += 2; // Spawn slightly away from death location
        this.y += 2;
        this.alive = true;
        this.aggro = false;

        console.log(`[Monster] ${this.name} has respawned!`);
        return true;
    }

    /**
     * Reset monster to initial state
     */
    reset() {
        Object.assign(this, this.getTypeData(this.type));
        this.x += 5;
        this.y += 5;
    }

    /**
     * Serialize monster state for saving/loading
     */
    toJSON() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            hp: this.hp,
            maxHp: this.maxHp,
            armor: this.armor,
            dmgMod: this.dmgMod,
            xpValue: this.expValue,
            goldValue: this.goldValue
        };
    }

    /**
     * Restore from serialized state
     */
    static fromJSON(data) {
        const monster = new Monster(data.type, data.x, data.y);
        
        // Copy serializable fields
        Object.assign(monster, data);
        
        return monster;
    }
}

export default Monster;
