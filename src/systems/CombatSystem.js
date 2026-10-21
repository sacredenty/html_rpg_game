/**
 * CombatSystem - Handles all combat logic for player and monster attacks
 */

import Monster from '../entities/Monster.js';

class CombatSystem {
    constructor(game) {
        this.game = game;
        this.player = null;
        
        // Combat state
        this.currentAttacker = null;
        this.lastCombatActionTime = 0;
        this.combatCooldown = 500; // ms between actions
        
        // Bind methods
        this.handleCombatAction = this.handleCombatAction.bind(this);
        this.resolveAttack = this.resolveAttack.bind(this);
    }

    /**
     * Attach player to combat system
     */
    attachPlayer(player) {
        this.player = player;
    }

    /**
     * Handle a combat action (attack, spell, etc.)
     * @param {string} type - Type of action: 'player', 'monster'
     * @param {object|null} target - Target of the attack
     */
    handleCombatAction(type, target) {
        const now = Date.now();

        if (now - this.lastCombatActionTime < this.combatCooldown) {
            return false; // On cooldown
        }

        this.lastCombatActionTime = now;

        switch (type) {
            case 'player':
                if (this.player && target?.alive) {
                    this.executePlayerAttack(target);
                }
                break;

            case 'monster':
                if (target && this.game.monsters.some(m => m.alive)) {
                    const aliveMonster = this.game.monsters.find(m => m.alive);
                    if (aliveMonster) {
                        this.executeMonsterAttack(aliveMonster, target);
                    }
                }
                break;

            case 'spell':
                this.executeSpell(target);
                break;
        }

        return true;
    }

    /**
     * Execute player attack on target
     */
    executePlayerAttack(target) {
        if (!this.player || !target) return 0;

        const damage = this.player.attack(target, this.calculateDamageMultiplier());
        
        // Feedback
        CombatSystem.showCombatFeedback(this.game, target.x, target.y, `You hit ${target.name} for ${Math.floor(damage)}!`, 'white');
        
        return Math.floor(damage);
    }

    /**
     * Execute monster attack on player or other entity
     */
    executeMonsterAttack(monster, target) {
        if (!monster || !target) return 0;

        const damage = monster.attack(target);
        
        // Feedback
        CombatSystem.showCombatFeedback(this.game, this.player.x, this.player.y, `${monster.name} hits you for ${Math.floor(damage)}!`, 'red');
        
        return Math.floor(damage);
    }

    /**
     * Execute spell cast on target
     */
    executeSpell(target) {
        if (!this.player || !target) return false;

        const spells = Object.values(this.player.allowedSpells || {});
        const spellId = spells[Math.floor(Math.random() * spells.length)];
        
        if (spellId) {
            const result = this.player.castSpell(spellId, target);
            
            if (result) {
                // Spell hit feedback
                CombatSystem.showCombatFeedback(this.game, this.player.x, this.player.y, `${this.player.className} casts ${spellId}!`, 'gold');
            }
            
            return result;
        }

        return false;
    }

    /**
     * Calculate damage multiplier based on stats/equipment
     */
    calculateDamageMultiplier() {
        const base = 1.0;
        const strengthBonus = this.player?.stats?.strength ? 0.1 : 0;
        return base + strengthBonus;
    }

    /**
     * Show combat feedback message on screen
     */
    static showCombatFeedback(game, x, y, message, color) {
        if (!game || !game.renderText) return;

        // This would integrate with game's text rendering system
        // Placeholder for now
        console.log(`[Combat] ${message}`);
    }

    /**
     * Get combat status summary
     */
    getStatus() {
        const player = this.player?.toJSON?.();
        const monsters = this.game.monsters.filter(m => m.alive)
            .map(m => m.toJSON())
            .reduce((acc, m) => [...acc, m], []);

        return {
            playerId: player?.name || null,
            playerLevel: player?.level || null,
            playerHp: player?.hp || null,
            playerClass: player?.classId || null,
            monsterCount: monsters.length,
            activeMonsters: monsters.map(m => ({
                name: m.name,
                hp: m.hp,
                maxHp: m.maxHp
            })),
            lastAction: this.lastCombatActionTime > 0 ? 'on cooldown' : null,
            isPlayerAlive: player && player.hp > 0
        };
    }

    /**
     * Reset combat cooldown
     */
    resetCooldown() {
        this.lastCombatActionTime = Date.now();
    }

    /**
     * Cleanup when needed
     */
    cleanup() {
        this.player = null;
        this.game = null;
    }
}

export default CombatSystem;
