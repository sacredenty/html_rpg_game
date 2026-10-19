// Quest System for RPG Adventure
// Enhanced version supporting main storyline quests and side quests with quest dropping

const QuestSystem = {
    // Quest categories with colors
    questCategories: {
        main: { label: 'Main Story', color: '#ef4444' },
        side: { label: 'Side Quests', color: '#8b5cf6' }
    },

    // Main storyline quests - required for game progression
    mainStorylineQuests: [
        {
            id: 'quest_king_call',
            name: "The King's Call",
            description: "King Alaric seeks heroes to defend our realm from growing darkness. The land is in turmoil, and only a brave adventurer can restore peace.",
            type: 'story', category: 'main',
            reward: { xp: 50, gold: 30 },
            prerequisites: [],
            objectives: [{ type: 'talk', target: 'king', description: 'Speak with King Alaric' }],
            completed: false
        },
        {
            id: 'quest_goblin_threat',
            name: 'Goblin Threat',
            description: "Defeat 5 goblins harassing the villages on our borders.",
            type: 'kill', category: 'main',
            reward: { xp: 100, gold: 100 },
            prerequisites: ['quest_king_call'],
            objectives: [{ type: 'kill', target: 'goblin', quantity: 5, description: 'Defeat goblins' }],
            completed: false
        },
        {
            id: 'quest_slime_clearance',
            name: 'Slime Clearing',
            description: "Clear the forest of dangerous slimes before they spread.",
            type: 'kill', category: 'main',
            reward: { xp: 80, gold: 60 },
            prerequisites: ['quest_goblin_threat'],
            objectives: [{ type: 'kill', target: 'slime', quantity: 10, description: 'Defeat corrupted slimes' }],
            completed: false
        },
        {
            id: 'quest_sword_hunt',
            name: 'The Legendary Sword',
            description: "A legendary blade is needed to defeat the dark lord. Find it in the dungeon.",
            type: 'collect', category: 'main',
            reward: { xp: 200, gold: 300 },
            prerequisites: ['quest_slime_clearance'],
            objectives: [{ type: 'collect', target: 'legendarySword', quantity: 1, description: 'Find the legendary sword' }],
            completed: false
        },
        {
            id: 'quest_dragon_slayer',
            name: 'Dragon Slayer',
            description: "The great dragon has awakened. Defeat it before it consumes our world.",
            type: 'kill', category: 'main',
            reward: { xp: 500, gold: 1000 },
            prerequisites: ['quest_sword_hunt'],
            objectives: [{ type: 'kill', target: 'dragon', quantity: 1, description: 'Defeat the Great Dragon' }],
            completed: false
        }
    ],

    // Side quests - optional but rewarding
    sideQuests: [
        {
            id: 'quest_herb_gatherer',
            name: 'Herb Gatherer',
            description: "Collect 5 healing herbs for the village healers.",
            type: 'collect', category: 'side',
            reward: { xp: 30, gold: 20 },
            prerequisites: [],
            objectives: [{ type: 'collect', target: 'healingHerb', quantity: 5, description: 'Collect healing herbs' }],
            completed: false
        },
        {
            id: 'quest_slime_hunter',
            name: 'Slime Hunter',
            description: "These pesky slimes need to be taught a lesson! Defeat 10 of them.",
            type: 'kill', category: 'side',
            reward: { xp: 50, gold: 30 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'slime', quantity: 10, description: 'Defeat slimes' }],
            completed: false
        },
        {
            id: 'quest_wolf_packer',
            name: 'Wolf Pack Problem',
            description: "A wolf pack is terrorizing travelers. Wipe them out!",
            type: 'kill', category: 'side',
            reward: { xp: 90, gold: 70 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'wolf', quantity: 5, description: 'Defeat wolves' }],
            completed: false
        },
        {
            id: 'quest_orc_hunter',
            name: 'Orc Hunting',
            description: "Orcs are raiding the mountain passes. Stop them!",
            type: 'kill', category: 'side',
            reward: { xp: 120, gold: 90 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'orc', quantity: 5, description: 'Defeat orcs' }],
            completed: false
        },
        {
            id: 'quest_skeleton_bane',
            name: 'Skeleton Slayer',
            description: "Ancient skeletons haunt the dungeon. Purge them!",
            type: 'kill', category: 'side',
            reward: { xp: 150, gold: 120 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'skeleton', quantity: 3, description: 'Defeat skeletons' }],
            completed: false
        },
        {
            id: 'quest_mana_hunter',
            name: 'Mana Hunter',
            description: "Collect mana crystals to boost our magical reserves.",
            type: 'collect', category: 'side',
            reward: { xp: 60, gold: 40 },
            prerequisites: [],
            objectives: [{ type: 'collect', target: 'manaCrystal', quantity: 3, description: 'Find mana crystals' }],
            completed: false
        },
        {
            id: 'quest_villager_aid',
            name: "Villager's Request",
            description: "An elderly villager needs help collecting firewood.",
            type: 'collect', category: 'side',
            reward: { xp: 40, gold: 25 },
            prerequisites: [],
            objectives: [{ type: 'collect', target: 'wood', quantity: 10, description: 'Gather firewood' }],
            completed: false
        }
    ],

    // Quest state tracking
    activeQuests: [],
    completedQuests: [],
    playerKillCounts: {},
    playerCollections: {},

    // Initialize quest system
    init(player) {
        const savedQuestData = this.getSavedQuestData();
        
        if (savedQuestData && savedQuestData.killCounts) {
            this.playerKillCounts = { ...savedQuestData.killCounts };
        }
        if (savedQuestData && savedQuestData.collections) {
            this.playerCollections = { ...savedQuestData.collections };
        }

        this.activeQuests = [...this.mainStorylineQuests, ...this.sideQuests]
            .map(quest => ({
                ...quest,
                state: savedQuestData && savedQuestData.quests[quest.id] 
                    ? { ...savedQuestData.quests[quest.id], completed: false }
                    : { accepted: false, progress: 0, objectivesCompleted: [], dropped: false }
            }));

        if (savedQuestData && savedQuestData.completedQuests) {
            this.completedQuests = savedQuestData.completedQuests.map(qid => 
                this.mainStorylineQuests.find(q => q.id === qid) || 
                this.sideQuests.find(q => q.id === qid)
            ).filter(Boolean);
        }

        this.checkPrerequisites();
        this.renderQuestBoard(player);
    },

    // Get saved quest data from localStorage
    getSavedQuestData() {
        const saved = localStorage.getItem('rpg_save');
        if (!saved) return null;
        try {
            const data = JSON.parse(saved);
            return data.quests || null;
        } catch {
            return null;
        }
    },

    // Save quest progress to localStorage
    saveQuestData() {
        const currentSave = localStorage.getItem('rpg_save');
        let gameData;
        
        if (currentSave) {
            try {
                gameData = JSON.parse(currentSave);
            } catch {
                return;
            }
        }

        const questData = {};
        this.activeQuests.forEach(quest => {
            if (quest.state) {
                questData[quest.id] = {
                    accepted: quest.state.accepted,
                    progress: quest.state.progress,
                    objectivesCompleted: quest.state.objectivesCompleted || [],
                    dropped: quest.state.dropped
                };
            }
        });

        const completedQuests = [];
        this.activeQuests.forEach(quest => {
            if (quest.state && quest.state.completed) {
                completedQuests.push(quest.id);
            }
        });

        if (gameData) {
            gameData.quests = questData;
            gameData.completedQuests = completedQuests;
            localStorage.setItem('rpg_save', JSON.stringify(gameData));
        } else {
            const newSave = {
                quests: questData,
                completedQuests: completedQuests,
                killCounts: this.playerKillCounts,
                collections: this.playerCollections
            };
            localStorage.setItem('rpg_save', JSON.stringify(newSave));
        }
    },

    // Check for prerequisites and unlock quests (only if not already accepted)
    checkPrerequisites() {
        this.activeQuests.forEach(quest => {
            // Don't accept quests that are already accepted, completed, or dropped
            if (quest.state && (quest.state.accepted || quest.state.completed || quest.state.dropped)) {
                return;
            }

            const prerequisites = quest.prerequisites || [];
            
            // Only auto-accept main storyline quests with non-empty prerequisites when they're completed
            // Side quests and the first main quest should require manual acceptance
            if (quest.category === 'main' && 
                prerequisites.length > 0 && 
                prerequisites.every(reqId => 
                    this.completedQuests.some(q => q.id === reqId)
                )) {
                quest.state.accepted = true;
                quest.state.progress = 0;
                quest.state.objectivesCompleted = [];
            }
        });
    },

    // Get quests that can be accepted
    getAvailableQuests() {
        return this.activeQuests.filter(quest => 
            !quest.state.accepted && 
            (!quest.prerequisites || quest.prerequisites.every(reqId => 
                this.completedQuests.some(q => q.id === reqId)
            ))
        );
    },

    // Accept a quest
    acceptQuest(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state) return false;

        quest.state.accepted = true;
        quest.state.progress = 0;
        quest.state.objectivesCompleted = [];
        
        this.saveQuestData();
        
        const container = document.getElementById('interaction-content');
        if (container) {
            container.innerHTML += `<p style="color: #10b981; margin-top: 15px;">✓ You've accepted "${quest.name}"!</p>`;
        }
        
        return true;
    },

    // Drop an accepted quest (only if not completed)
    dropQuest(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state) return false;

        // Cannot drop completed quests
        if (quest.state.completed) {
            console.log(`Cannot drop completed quest: ${quest.name}`);
            return false;
        }

        // Mark quest as dropped
        quest.state.dropped = true;
        quest.state.accepted = false;
        
        this.saveQuestData();
        
        const container = document.getElementById('interaction-content');
        if (container) {
            container.innerHTML += `<p style="color: #f87171; margin-top: 15px;">⚠️ You've dropped "${quest.name}".</p>`;
        }
        
        this.renderQuestBoard(Game.player);
        
        return true;
    },

    // Get list of droppable quests
    getDroppableQuests() {
        return this.activeQuests.filter(quest => 
            quest.state && 
            quest.state.accepted && 
            !quest.state.completed &&
            !quest.state.dropped
        );
    },

    // Complete a quest objective
    completeObjective(questId, objectiveType, target) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state) return false;

        if (objectiveType === 'kill') {
            this.playerKillCounts[target] = (this.playerKillCounts[target] || 0) + 1;
        } else if (objectiveType === 'collect') {
            this.playerCollections[target] = (this.playerCollections[target] || 0) + 1;
        }

        const objective = quest.objectives.find(obj => obj.type === objectiveType);
        if (!objective) return false;

        const targetCount = objective.quantity || 1;
        
        if (this.playerKillCounts[target] >= targetCount || 
            this.playerCollections[target] >= targetCount) {
            
            if (!quest.state.objectivesCompleted.includes(objectiveType)) {
                quest.state.objectivesCompleted.push(objectiveType);
                
                this.saveQuestData();
                
                if (this.checkQuestComplete(quest)) {
                    return true;
                }
            }
        }

        return false;
    },

    // Check if quest is complete
    checkQuestComplete(quest) {
        const objectives = quest.objectives || [];
        const allComplete = objectives.every(obj => 
            quest.state.objectivesCompleted.includes(obj.type)
        );

        if (allComplete && !quest.state.completed) {
            quest.state.completed = true;
            this.saveQuestData();
            
            quest = this.activeQuests.find(q => q.id === quest.id);
            if (quest) {
                this.completedQuests.push(quest);
                
                const container = document.getElementById('interaction-content');
                if (container) {
                    const rewardText = `You've completed "${quest.name}"! Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold`;
                    container.innerHTML += `<p style="color: #fbbf24; font-weight: bold; margin-top: 15px;">🎉 ${rewardText}</p>`;
                }
                
                if (quest.category === 'main') {
                    const nextQuestIndex = this.mainStorylineQuests.findIndex(q => q.id === quest.id) + 1;
                    if (nextQuestIndex < this.mainStorylineQuests.length) {
                        const nextQuestId = this.mainStorylineQuests[nextQuestIndex].id;
                        this.checkPrerequisites();
                        QuestSystem.renderQuestBoard(Game.player);
                    }
                }
            }
        }

        return allComplete;
    },

    // Get quest color based on category
    getQuestColor(category) {
        return this.questCategories[category]?.color || '#9ca3af';
    },

    // Render quest board
    renderQuestBoard(player = Game.player) {
        const container = document.getElementById('active-quests-container');
        if (!container) return;

        const active = this.activeQuests.filter(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );
        const completed = this.completedQuests;
        const available = this.getAvailableQuests();

        let activeHtml = '';
        if (active.length) {
            activeHtml = '<h4 style="margin: 10px 0;">In Progress</h4>' + 
                active.map(quest => `
                    <div style="background: #f3f4f6; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <strong style="color: #1f2937;">${quest.name}</strong><br>
                        <small style="color: #374151;">${quest.description}</small><br>
                        <span style="font-size: 12px; color: #6b7280;">
                            Progress: ${quest.state.progress}/${quest.objectives?.find(o => o.type === 'kill' || o.type === 'collect')?.quantity || '?'}
                        </span><br>
                        <button 
                            type="button" 
                            class="quest-drop-btn"
                            data-quest-id="${quest.id}" 
                            style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 5px;">
                            Drop Quest
                        </button>
                    </div>
                `).join('')
            ;
        } else {
            activeHtml = '<p style="color: #6b7280;">No active quests.</p>';
        }

        let completedHtml = '';
        if (completed.length) {
            completedHtml = '<h4 style="margin: 10px 0; color: #059669;">Completed</h4>' +
                completed.map(quest => `
                    <div style="background: #d1fae5; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        <strong style="color: #065f46;">${quest.name} ✓</strong><br>
                        <small style="color: #047857;">Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold</small>
                    </div>
                `).join('')
            ;
        } else {
            completedHtml = '<p style="color: #6b7280;">No completed quests.</p>';
        }

        let availableHtml = '';
        if (available.length) {
            availableHtml = '<h4 style="margin: 10px 0; color: #059669;">Available Quests</h4>' + 
                available.map(quest => `
                    <div class="shop-item" style="background: #f9fafb; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <strong style="font-size: 15px; color: #1f2937;">${quest.name}</strong>
                                <small style="color: #4b5563;">${quest.description}</small><br>
                                <span style="font-size: 12px; color: #6b7280;">
                                    Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold
                                </span>
                            </div>
                            <button 
                                type="button" 
                                class="quest-accept-btn"
                                data-quest-id="${quest.id}" 
                                style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                Accept
                            </button>
                        </div>
                    </div>
                `).join('')
            ;
        } else {
            availableHtml = '<p style="color: #4b5563;">No new quests available. Talk to King Alaric for a main quest!</p>';
        }

        container.innerHTML = `
            <div style="padding: 15px;">
                ${activeHtml}
                ${completedHtml}
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e5e7eb;">
                ${availableHtml}
            </div>
        `;

        container.querySelectorAll('.quest-accept-btn').forEach(button => {
            button.addEventListener('click', () => {
                const questId = button.dataset.questId;
                if (this.acceptQuest(questId)) {
                    button.parentElement.remove();
                }
            });
        });

        container.querySelectorAll('.quest-drop-btn').forEach(button => {
            button.addEventListener('click', () => {
                const questId = button.dataset.questId;
                if (this.dropQuest(questId)) {
                    button.parentElement.remove();
                }
            });
        });
    },

    // Render active quests panel
    renderActiveQuests() {
        const container = document.getElementById('interaction-content');
        if (!container) return;

        const active = this.activeQuests.filter(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );

        let html = '';
        if (active.length) {
            html += '<h4 style="margin: 0 0 10px;">Active Quests</h4>';
            
            active.forEach(quest => {
                const objective = quest.objectives?.find(o => 
                    o.type === 'kill' || o.type === 'collect'
                );
                if (!objective) return;

                const progress = this.playerKillCounts[objective.target] || 
                               this.playerCollections[objective.target] || 0;
                const total = objective.quantity;
                
                html += `
                    <div style="background: #1e293b; padding: 12px; margin: 8px 0; border-radius: 6px;">
                        <strong style="color: #fbbf24;">${quest.name}</strong><br>
                        <small style="color: #94a3b8;">${quest.description}</small><br>
                        <span style="color: #60a5fa; font-size: 14px;">
                            Progress: ${progress}/${total}
                        </span><br>
                        <button 
                            type="button" 
                            class="quest-drop-btn active-quest-drop"
                            data-quest-id="${quest.id}" 
                            style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 5px;">
                            Drop Quest
                        </button>
                    </div>
                `;
            });

            html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #374151;">';
        }

        container.innerHTML = html || '<p style="color: #9ca3af;">No active quests.</p>';
    },

    // Get available quest count
    getAvailableQuestCount() {
        return this.getAvailableQuests().length;
    },

    // Check if player has any accepted quests
    hasActiveQuests() {
        return this.activeQuests.some(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );
    }
};
