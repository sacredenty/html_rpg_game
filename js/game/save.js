// Save game behavior
Object.assign(Game, {
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
});
