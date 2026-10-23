// Combat and spellcasting actions
const GameCombat = {
    // Attack action
    attack() {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        const nearbyMonsters = this.monsters.filter(monster =>
            Utils.distance(this.player, monster) <= 3 && monster.alive
        );

        if (nearbyMonsters.length > 0) {
            const targetMonster = this.findNearestMonster(nearbyMonsters);
            Utils.showMessage(`Attacking ${targetMonster.name}!`, 'info');
            this.combat(targetMonster);
        } else {
            const allMonsters = this.monsters.filter(monster => monster.alive);
            if (allMonsters.length > 0) {
                const nearest = this.findNearestMonster(allMonsters);
                Utils.showMessage(`No enemies in range. Move closer to ${nearest.name} to attack!`, 'warning');
            } else {
                Utils.showMessage('No enemies in the world!', 'error');
            }
        }
    },

    findNearestMonster(monsterList) {
        let nearest = null;
        let minDistance = Infinity;

        for (const monster of monsterList) {
            const distance = Utils.distance(this.player, monster);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = monster;
            }
        }
        return nearest;
    },

    findFurthestMonster(monsterList) {
        let furthest = null;
        let maxDistance = -1;

        for (const monster of monsterList) {
            const distance = Utils.distance(this.player, monster);
            if (distance > maxDistance) {
                maxDistance = distance;
                furthest = monster;
            }
        }
        return furthest;
    },

    combat(monster) {
        if (!monster.alive) return;

        GameAudio.attack();
        const playerDamage = (this.player.stats.strength +
            this.player.getEquipmentBonus('strength')) * 1.5;
        const actualDamage = Math.max(1, playerDamage - monster.defense);
        this.damageMonster(monster, actualDamage, '#ef4444');

        if (monster.alive) this.monsterTurn(monster);

        this.render();
        return new Promise(resolve => setTimeout(resolve, 100));
    },

    damageMonster(monster, damage, color) {
        GameAudio.hit();
        monster.hp = Math.max(0, monster.hp - damage);
        this.renderCombatFeedback(monster.x, monster.y, `-${Math.floor(damage)}`, color);

        if (monster.hp <= 0) {
            monster.alive = false;
            const levelsGained = this.player.gainXp(monster.xp);
            const goldGained = this.calculateMonsterGold(monster);
            this.addGold(goldGained);
            const levelMessage = levelsGained > 0 ? ` Level up! You reached level ${this.player.level}.` : '';
            
            // Check for kill quests using helper method
            const killQuests = QuestSystem.getKillQuestsByTarget(monster.type);
            if (killQuests.length > 0) {
                // Complete the first active quest for this target type
                const quest = killQuests[0];
                const completed = QuestSystem.completeObjective(quest.id, {
                    type: 'kill',
                    target: monster.type,
                    quantity: 1
                });
                // Update UI to show progress after completing objective
                if (completed) {
                    QuestSystem.renderQuestBoard(Game.player, false);
                }
            }
            
            Utils.showMessage(`Defeated ${monster.name}! Gained ${monster.xp} XP and ${goldGained} gold.${levelMessage}`, 'success');
            GameAudio.victory();
            this.removeEntity(monster);
            this.updateEnemyHealthBar();
        } else {
            this.flashMonster(monster);
            this.setTargetedEnemy(monster);
        }
    },

    monstersTurn() {
        if (this.player.hp <= 0) return;
        this.monsters
            .filter(monster => monster.alive && Utils.distance(this.player, monster) <= 1.5)
            .forEach(monster => this.monsterTurn(monster));
    },

    calculateMonsterGold(monster) {
        const baseGold = Utils.random(monster.gold - 2, monster.gold + 3);
        return Math.max(1, Math.round(baseGold * this.getDifficultySettings().goldMultiplier));
    },

    calculateMonsterDamage(monster) {
        const defense = this.player.stats.endurance + this.player.getEquipmentBonus('defense');
        const baseDamage = Math.max(0, monster.attack * 1.2 - defense);
        return Math.max(1, Math.floor(baseDamage * this.getDifficultySettings().monsterDamageMultiplier));
    },

    monsterTurn(monster) {
        if (this.player.hp <= 0 || !monster.alive ||
            Utils.distance(this.player, monster) > 1.5 || Math.random() >= 0.3) return;

        const actualDamage = this.calculateMonsterDamage(monster);
        this.player.hp -= actualDamage;

        if (actualDamage > 0) {
            GameAudio.hit();
            this.renderCombatFeedback(this.player.x, this.player.y, `-${actualDamage}`, '#fca5a5');
            Utils.showMessage(`${monster.name} attacks you!`, 'warning');
        }
        if (this.player.hp <= 0) this.gameOver();
    },

    castSpell(spellId) {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        const spell = Entities.Spells[spellId];
        if (!spell) {
            Utils.showMessage('That spell is not available.', 'error');
            return;
        }
        if (!this.player.canCastSpell(spellId)) {
            Utils.showMessage(`${this.player.className} cannot cast ${spell.name}.`, 'error');
            return;
        }

        let target = null;
        if (spell.type === 'damage') {
            const nearbyMonsters = this.monsters.filter(monster =>
                monster.alive && Utils.distance(this.player, monster) <= spell.range
            );
            if (nearbyMonsters.length === 0) {
                Utils.showMessage(`No enemies are within ${spell.range} tiles.`, 'warning');
                return;
            }
            target = this.findNearestMonster(nearbyMonsters);
        } else if (spell.type === 'heal' && this.player.hp >= this.player.maxHp) {
            Utils.showMessage('Your HP is already full.', 'info');
            return;
        }

        if (this.player.mp < spell.manaCost) {
            Utils.showMessage(`Not enough MP to cast ${spell.name}.`, 'warning');
            return;
        }

        this.player.mp -= spell.manaCost;
        GameAudio.cast();
        if (spell.type === 'damage') {
            const damage = Math.max(1, this.player.stats.magic * spell.power - target.defense);
            this.damageMonster(target, damage, spell.color);
            Utils.showMessage(`Cast ${spell.name} on ${target.name} for ${Math.floor(damage)} damage!`, 'success');
            if (target.alive) this.monsterTurn(target);
        } else {
            GameAudio.heal();
            const healing = spell.baseHealing + this.player.stats.magic * spell.healingPerMagic;
            const restored = Math.min(healing, this.player.maxHp - this.player.hp);
            this.player.hp += restored;
            Utils.showMessage(`Cast ${spell.name} and restored ${restored} HP!`, 'success');
        }
        this.render();
    }
};

Object.assign(Game, GameCombat);
