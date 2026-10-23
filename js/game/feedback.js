// Feedback game behavior
Object.assign(Game, {
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
                    // Add progress to the quest and render UI immediately
                    QuestSystem.completeObjective(quest.id, {
                        type: 'collect',
                        target: item.type,
                        quantity: 1
                    });
                    
                    // Always render quests panel to show immediate update for collection
                    QuestSystem.renderQuestBoard(Game.player, false);
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
});
