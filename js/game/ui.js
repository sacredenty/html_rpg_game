// Ui game behavior with optimized rendering
Object.assign(Game, {
    // Throttle function to limit how often a function can be called
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    setupEventListeners() {
        document.addEventListener('pointerdown', () => GameAudio.unlock(), { once: true });
        document.addEventListener('keydown', () => GameAudio.unlock(), { once: true });

        // Track character creation modal state to disable WASD during creation
        const charCreationModal = document.getElementById('character-creation');
        
        function handleCharacterCreationState() {
            if (charCreationModal && charCreationModal.showModal) {
                const isOpen = charCreationModal.open;
                if (isOpen) {
                    // Disable WASD when character creation is open
                    document.body.style.cursor = 'default';
                } else {
                    // Re-enable WASD when modal closes
                    document.body.style.cursor = '';
                }
            }
        }

        charCreationModal.addEventListener('click', handleCharacterCreationState);
        
        // Add Escape key to close modal
        charCreationModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                charCreationModal.close();
            }
        });

        document.getElementById('load-saved-game').addEventListener('click', () => {
            this.openSaveSlotPicker('load', true);
        });
        document.getElementById('new-adventure').addEventListener('click', () => {
            document.getElementById('startup-menu').close();
            this.characterCreationStep = 0;
            this.renderCharacterCreationStep();
            document.getElementById('character-creation').showModal();
        });
        document.getElementById('close-save-slots').addEventListener('click', () => {
            document.getElementById('save-slot-dialog').close();
        });
        document.getElementById('save-slot-dialog').addEventListener('close', () => {
            if (this.saveSlotReturnToStartup) document.getElementById('startup-menu').showModal();
        });
        document.getElementById('character-creation-form').addEventListener('submit', event => {
            event.preventDefault();
            if (this.characterCreationStep < 2) {
                this.advanceCharacterCreation();
            } else {
                const name = document.getElementById('hero-name').value.trim();
                const classId = document.querySelector('input[name="hero-class"]:checked')?.value;
                const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
                document.getElementById('hero-name').setCustomValidity('');
                this.startAdventure(name, classId, difficulty);
            }
        });
        document.getElementById('character-next').addEventListener('click', () =>
            this.advanceCharacterCreation()
        );
        document.getElementById('character-back').addEventListener('click', () => {
            this.characterCreationStep = Math.max(0, this.characterCreationStep - 1);
            this.renderCharacterCreationStep();
        });
        document.getElementById('hero-name').addEventListener('input', event => {
            event.currentTarget.setCustomValidity('');
        });
        document.querySelectorAll('input[name="hero-class"]').forEach(input => {
            input.addEventListener('change', () => this.updateClassDescription());
        });

        // Directional movement buttons
        document.getElementById('move-north').addEventListener('click', () => this.moveNorth());
        document.getElementById('move-south').addEventListener('click', () => this.moveSouth());
        document.getElementById('move-west').addEventListener('click', () => this.moveWest());
        document.getElementById('move-east').addEventListener('click', () => this.moveEast());

        // Keyboard arrow key bindings for directional movement
        document.addEventListener('keydown', event => {
            // Skip WASD keys when character creation modal is open
            const charCreationModal = document.getElementById('character-creation');
            if (charCreationModal && charCreationModal.open) {
                return;
            }

            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    event.preventDefault();
                    this.moveNorth();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    event.preventDefault();
                    this.moveSouth();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    event.preventDefault();
                    this.moveWest();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    event.preventDefault();
                    this.moveEast();
                    break;
            }
        });

        // Explore button (random movement)
        document.getElementById('explore-btn').addEventListener('click', () => this.explore());
        
        // Other action buttons
        document.getElementById('attack-btn').addEventListener('click', () => this.attack());
        document.getElementById('rest-btn').addEventListener('click', () => this.rest());
        document.getElementById('cast-spell-btn').addEventListener('click', () =>
            this.castSpell(document.getElementById('spell-select').value)
        );
        document.getElementById('spell-select').addEventListener('change', () => this.updateSpellDisplay());
        document.getElementById('interact-btn').addEventListener('click', () => this.interact());
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.openSaveSlotPicker('load'));
        document.getElementById('music-toggle').addEventListener('click', event => {
            const enabled = !GameAudio.musicEnabled;
            GameAudio.setMusicEnabled(enabled);
            event.currentTarget.textContent = `Music: ${enabled ? 'On' : 'Off'}`;
            event.currentTarget.setAttribute('aria-pressed', String(enabled));
        });
        document.getElementById('effects-toggle').addEventListener('click', event => {
            const enabled = !GameAudio.effectsEnabled;
            GameAudio.setEffectsEnabled(enabled);
            event.currentTarget.textContent = `Effects: ${enabled ? 'On' : 'Off'}`;
            event.currentTarget.setAttribute('aria-pressed', String(enabled));
        });
        document.getElementById('close-interaction').addEventListener('click', () => {
            document.getElementById('interaction-panel').hidden = true;
        });
        this.canvas.addEventListener('click', event => {
            const bounds = this.canvas.getBoundingClientRect();
            const tileX = this.cameraX +
                Math.floor((event.clientX - bounds.left) * this.viewWidth / bounds.width);
            const tileY = this.cameraY +
                Math.floor((event.clientY - bounds.top) * this.viewHeight / bounds.height);
            const npc = this.npcs.find(candidate =>
                candidate.alive && candidate.x === tileX && candidate.y === tileY
            );
            if (npc) this.openNPCInteraction(npc);
        });
        
        document.getElementById('use-item-btn').addEventListener('click', () => {
            const usableItems = this.player.inventory.filter(item => {
                const itemTemplate = Entities.Items[item.type];
                const effect = itemTemplate?.effect?.();
                return !itemTemplate?.equipmentSlot && !(effect?.mp && this.player.maxMp === 0);
            });
            if (usableItems.length > 0) {
                const itemId = usableItems[Utils.random(0, usableItems.length - 1)].id;
                this.useItem(itemId);
            }
        });

        // Display inventory items when they're added
        const updateInventoryDisplay = () => {
            const list = document.getElementById('inventory-list');
            const btn = document.getElementById('use-item-btn');
            document.getElementById('item-count').textContent = this.player.inventory.length;

            if (this.player.inventory.length === 0) {
                list.innerHTML = '<p style="color:#9ca3af;text-align:center;padding:10px;">No items collected yet</p>';
            } else {
                let html = '';
                this.player.inventory.forEach(item => {
                    const itemTemplate = Entities.Items[item.type];
                    const isEquipment = Boolean(itemTemplate?.equipmentSlot);
                    const itemEffect = itemTemplate?.effect?.();
                    const unavailable = Boolean(itemEffect?.mp && this.player.maxMp === 0);
                    html += `
                        <div class="inventory-item">
                            <span class="inventory-item-name"><span>${item.symbol}</span> ${item.name}</span>
                            <span class="inventory-item-actions">
                                ${isEquipment
                                    ? `<button type="button" data-equip-item="${item.id}">Equip</button>`
                                    : `<button type="button" data-use-item="${item.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? 'No mana' : 'Use'}</button>`}
                            </span>
                        </div>
                    `;
                });
                list.innerHTML = html;
            }
            btn.disabled = !this.player.inventory.some(item => {
                const itemTemplate = Entities.Items[item.type];
                const effect = itemTemplate?.effect?.();
                return !itemTemplate?.equipmentSlot && !(effect?.mp && this.player.maxMp === 0);
            });

            list.querySelectorAll('[data-equip-item]').forEach(button => {
                button.addEventListener('click', () => this.equipItem(button.dataset.equipItem));
            });
            list.querySelectorAll('[data-use-item]').forEach(button => {
                button.addEventListener('click', () => this.useItem(button.dataset.useItem));
            });
            if (document.getElementById('interaction-panel').dataset.type === 'merchant') {
                this.updateTradeDisplay();
            }
        };

        this.updateInventoryDisplay = updateInventoryDisplay;

        this.updateEquipmentDisplay = () => {
            const slots = document.getElementById('equipment-slots');
            const slotLabels = {
                weapon: 'Weapon',
                armor: 'Armor',
                shield: 'Shield', 
                accessory: 'Accessory'
            };
            slots.innerHTML = Object.entries(slotLabels).map(([slot, label]) => {
                const item = this.player.equipment[slot];
                const bonusText = item
                    ? Object.entries(item.bonuses || {})
                        .map(([stat, value]) => `+${value} ${stat === 'goldPerRest' ? 'gold/rest' : stat}`)
                        .join(', ')
                    : 'Empty';
                return `
                    <div class="equipment-slot">
                        <span><strong>${label}:</strong> ${item ? `${item.symbol} ${item.name}` : 'Empty'}
                            ${item ? `<small>${bonusText}</small>` : ''}
                        </span>
                        ${item ? `<button type="button" data-unequip-slot="${slot}">Unequip</button>` : ''}
                    </div>
                `;
            }).join('');

            slots.querySelectorAll('[data-unequip-slot]').forEach(button => {
                button.addEventListener('click', () => this.unequipItem(button.dataset.unequipSlot));
            });
        };

        // Call this function when items are added to inventory
        window.updateInventoryDisplay = () => {
            this.updateInventoryDisplay();
            this.updateEquipmentDisplay();
        };
        
        // Initial call after game initialization
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.updateSpellDisplay();
        this.updateAbilitiesDisplay();
    },

    updateClassDescription() {
        const classId = document.querySelector('input[name="hero-class"]:checked')?.value;
        const playerClass = Entities.PlayerClasses[classId];
        if (!playerClass) {
            throw new Error(`Unknown hero class: ${classId}`);
        }
        document.getElementById('class-description').textContent = playerClass.description;
        document.getElementById('class-stat-summary').textContent =
            `STR ${playerClass.stats.strength} · MAG ${playerClass.stats.magic} · ` +
            `END ${playerClass.stats.endurance} · AGI ${playerClass.stats.agility} · ` +
            `HP ${playerClass.maxHp} · MP ${playerClass.maxMp}`;
        this.drawClassPreview(classId);
        document.getElementById('review-hero-name').textContent =
            document.getElementById('hero-name').value.trim();
        document.getElementById('review-hero-class').textContent = playerClass.name;
        document.getElementById('review-class-description').textContent = playerClass.description;
        document.getElementById('review-class-stats').textContent =
            document.getElementById('class-stat-summary').textContent;
        const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
        const difficultySettings = this.difficultySettings[difficulty];
        if (!difficultySettings) {
            throw new Error(`Unknown difficulty: ${difficulty}`);
        }
        document.getElementById('review-difficulty').textContent =
            `${difficultySettings.label} — Monsters deal ${Math.round(difficultySettings.monsterDamageMultiplier * 100)}% damage; ` +
            `gold rewards are ${Math.round(difficultySettings.goldMultiplier * 100)}%.`;
    },

    updateStartupAvailability() {
        const loadButton = document.getElementById('load-saved-game');
        const status = document.getElementById('startup-save-status');
        try {
            let hasSave = false;
            for (let slot = 1; slot <= 3; slot++) {
                try {
                    hasSave = Boolean(this.readSaveSlot(slot)?.player) || hasSave;
                } catch (error) {
                    console.error(`Failed to check save slot ${slot}:`, error);
                }
            }
            loadButton.disabled = !hasSave;
            status.textContent = hasSave
                ? 'Choose a saved adventure to continue from any of the three slots.'
                : 'No saved adventure found. Start a new adventure to create your hero.';
        } catch (error) {
            console.error('Failed to check for a saved game:', error);
            loadButton.disabled = true;
            status.textContent = 'Saved games are unavailable because browser storage could not be accessed.';
        }
    },

    readSaveSlot(slot) {
        const stored = localStorage.getItem(this.saveSlotKey(slot)) ??
            (slot === 1 ? localStorage.getItem('rpg_save') : null);
        return stored ? JSON.parse(stored) : null;
    },

    saveSlotKey(slot) {
        return `rpg_save_slot_${slot}`;
    },

    openSaveSlotPicker(mode, returnToStartup = false) {
        this.saveSlotMode = mode;
        this.saveSlotReturnToStartup = returnToStartup;
        document.getElementById('save-slot-title').textContent =
            mode === 'save' ? 'Save Game' : 'Load Game';
        document.getElementById('save-slot-instructions').textContent =
            mode === 'save'
                ? 'Choose a slot. Saving to an occupied slot will ask for confirmation.'
                : 'Choose a saved adventure to continue.';
        this.renderSaveSlots();
        if (returnToStartup) document.getElementById('startup-menu').close();
        document.getElementById('save-slot-dialog').showModal();
    },

    renderSaveSlots() {
        const list = document.getElementById('save-slot-list');
        list.replaceChildren();
        for (let slot = 1; slot <= 3; slot++) {
            const row = document.createElement('div');
            row.className = 'save-slot';
            const details = document.createElement('div');
            details.className = 'save-slot-details';
            const title = document.createElement('strong');
            title.textContent = `Slot ${slot}`;
            const summary = document.createElement('span');
            let saved = null;
            try {
                saved = this.readSaveSlot(slot);
            } catch (error) {
                console.error(`Failed to read save slot ${slot}:`, error);
            }

            if (saved?.player) {
                const playerClass = saved.player.className || 'Adventurer';
                const savedLevel = saved.player.level ?? saved.player._level;
                const level = Number.isFinite(Number(savedLevel)) && Number(savedLevel) > 0
                    ? Number(savedLevel)
                    : 1;
                summary.textContent =
                    `${saved.player.name || 'Unnamed hero'} · ${playerClass} · Level ${level}`;
            } else if (saved) {
                summary.textContent = 'Unreadable save data';
            } else {
                summary.textContent = 'Empty';
            }
            details.append(title, summary);

            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = this.saveSlotMode === 'save' ? 'Save Here' : 'Load';
            button.disabled = this.saveSlotMode === 'load' && !saved?.player;
            button.addEventListener('click', () => {
                if (this.saveSlotMode === 'save') {
                    if (saved && !window.confirm(`Overwrite the saved game in Slot ${slot}?`)) return;
                    if (this.saveGame(slot)) document.getElementById('save-slot-dialog').close();
                } else if (this.loadGame(slot)) {
                    document.getElementById('save-slot-dialog').close();
                }
            });
            row.append(details, button);
            list.append(row);
        }
    },

    drawClassPreview(classId) {
        const preview = document.getElementById('class-preview');
        const ctx = preview.getContext('2d');
        ctx.clearRect(0, 0, preview.width, preview.height);
        SpriteRenderer.drawHeroAppearance(
            { ctx, TILE_SIZE: preview.width },
            classId,
            0,
            0
        );
    },

    advanceCharacterCreation() {
        if (this.characterCreationStep === 0) {
            const nameInput = document.getElementById('hero-name');
            if (!nameInput.value.trim()) {
                nameInput.setCustomValidity('Enter a name for your hero.');
                nameInput.reportValidity();
                return;
            }
            nameInput.setCustomValidity('');
        }
        this.characterCreationStep = Math.min(2, this.characterCreationStep + 1);
        this.renderCharacterCreationStep();
    },

    renderCharacterCreationStep() {
        const steps = [
            document.getElementById('character-step-identity'),
            document.getElementById('character-step-class'),
            document.getElementById('character-step-review')
        ];
        const stepNames = ['Identity', 'Class', 'Review'];
        steps.forEach((step, index) => {
            step.hidden = index !== this.characterCreationStep;
        });
        document.getElementById('creation-progress').textContent =
            `Step ${this.characterCreationStep + 1} of ${steps.length}: ${stepNames[this.characterCreationStep]}`;
        document.getElementById('character-back').hidden = this.characterCreationStep === 0;
        document.getElementById('character-next').hidden = this.characterCreationStep === steps.length - 1;
        document.getElementById('character-submit').hidden = this.characterCreationStep !== steps.length - 1;
        this.updateClassDescription();
        if (this.characterCreationStep === 0) {
            document.getElementById('hero-name').focus();
        } else if (this.characterCreationStep === 1) {
            document.querySelector('input[name="hero-class"]:checked').focus();
        } else {
            document.getElementById('character-step-review').focus();
        }
    },

    startAdventure(name, classId, difficulty = 'medium') {
        if (!Entities.PlayerClasses[classId]) {
            Utils.showMessage('Choose a valid hero class before starting.', 'error');
            return;
        }
        if (!Object.hasOwn(this.difficultySettings, difficulty)) {
            Utils.showMessage('Choose a valid difficulty before starting.', 'error');
            return;
        }
        if (!name) {
            this.characterCreationStep = 0;
            this.renderCharacterCreationStep();
            document.getElementById('hero-name').setCustomValidity('Enter a name for your hero.');
            document.getElementById('hero-name').reportValidity();
            return;
        }
        this.difficulty = difficulty;
        this.updateDifficultyDisplay();
        this.player = new Entities.Player(name, classId);
        this.currentSaveSlot = null;
        QuestSystem.init(this.player, null);
        this.player.updateStatsDisplay();
        this.updateSpellDisplay();
        this.updateCamera();
        window.updateInventoryDisplay();
        this.render();
        document.getElementById('character-creation').close();
    },

    updateSpellDisplay() {
        const select = document.getElementById('spell-select');
        const castButton = document.getElementById('cast-spell-btn');
        const selectedSpell = select.value;
        const availableSpells = Object.entries(Entities.Spells).filter(([id]) =>
            this.player.canCastSpell(id)
        );
        select.innerHTML = availableSpells.map(([id, spell]) =>
            `<option value="${id}">${spell.name} (${spell.manaCost} MP)</option>`
        ).join('');
        if (availableSpells.some(([id]) => id === selectedSpell)) select.value = selectedSpell;

        const spell = Entities.Spells[select.value];
        select.disabled = availableSpells.length === 0;
        castButton.disabled = availableSpells.length === 0;
        const description = availableSpells.length === 0
            ? `${this.player.className} cannot cast spells.`
            : spell
                ? `${spell.description} Cost: ${spell.manaCost} MP${spell.range ? ` · Range: ${spell.range} tiles` : ''}`
                : '';
        document.getElementById('spell-description').textContent = description;
    },

    updateAbilitiesDisplay() {
        const abilitiesPanel = document.querySelector('.abilities-panel');
        if (!abilitiesPanel) return;
        
        const abilities = this.player.getAvailableAbilities();
        const container = document.getElementById('abilities-list');
        if (!container) return;
        
        if (abilities.length === 0) {
            container.innerHTML = '<p>No abilities unlocked yet.</p>';
        } else {
            container.innerHTML = abilities.map(ability => `
                <div class="ability-item">
                    <strong>${ability.name}</strong> <small>(Level ${ability.level})</small><br>
                    <span class="ability-description">${ability.description}</span>
                    ${ability.type ? `<span class="ability-type">[${ability.type}]</span>` : ''}
                </div>
            `).join('');
        }
    },
});
