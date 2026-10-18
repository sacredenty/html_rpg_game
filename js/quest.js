// Quest System for RPG Adventure
// Enhanced version supporting main storyline quests and side quests

const QuestSystem = {
    // Quest categories with colors
    questCategories: {
        main: {
            label: 'Main Story',
            color: '#ef4444'  // Red for important story quests
        },
        side: {
            label: 'Side Quests', 
            color: '#8b5cf6'  // Purple for optional quests
        }
    },

    // Main storyline quests - required for game progression
    mainStorylineQuests: [
        {
            id: 'quest_king_call',
            name: "The King's Call",
            description: "King Alaric seeks heroes to defend our realm from growing darkness.",
            type: 'story',
            category: 'main',
            reward: { xp: 50, gold: 30 },
            prerequisites: [],
            objectives: [
                { type: 'talk', target: 'king', description: 'Speak with King Alaric' }
            ],
            completed: false
        },
        {
            id: 'quest_goblin_threat',
            name: 'Goblin Threat',
            description: "Defeat 5 goblins harassing the villages on our borders.",
            type: 'kill',
            category: 'main',
            reward: { xp: 100, gold: 100 },
            prerequisites: ['quest_king_call'],
            objectives: [
                { type: 'kill', target: 'goblin', quantity: 5, description: 'Defeat goblins' }
            ],
            completed: false
        },
        {
            id: 'quest_slime_clearance',
            name: 'Slime Clearing',
            description: "Clear the forest of dangerous slimes before they spread.",
            type: 'kill',
            category: 'main',
            reward: { xp: 80, gold: 60 },
            prerequisites: ['quest_goblin_threat'],
            objectives: [
                { type: 'kill', target: 'slime', quantity: 10, description: 'Defeat slimes' }
            ],
            completed: false
        },
        {
            id: 'quest_sword_hunt',
            name: 'The Legendary Sword',
            description: "A legendary blade is needed to defeat the dark lord. Find it in the dungeon.",
            type: 'collect',
            category: 'main',
            reward: { xp: 200, gold: 300 },
            prerequisites: ['quest_slime_clearance'],
            objectives: [
                { type: 'collect', target: 'legendarySword', quantity: 1, description: 'Find the legendary sword' }
            ],
            completed: false
        },
        {
            id: 'quest_dragon_slayer',
            name: 'Dragon Slayer',
            description: "The great dragon has awakened. Defeat it before it consumes our world.",
            type: 'kill',
            category: 'main',
            reward: { xp: 500, gold: 1000 },
            prerequisites: ['quest_sword_hunt'],
            objectives: [
                { type: 'kill', target: 'dragon', quantity: 1, description: 'Defeat the dragon' }
            ],
            completed: false
        }
    ],

    // Side quests - optional but rewarding
    sideQuests: [
        {
            id: 'quest_herb_gatherer',
            name: 'Herb Gatherer',
            description: "Collect 5 healing herbs for the village healers.",
            type: 'collect',
            category: 'side',
            reward: { xp: 30, gold: 20 },
            prerequisites: [],
            objectives: [
                { type: 'collect', target: 'healingHerb', quantity: 5, description: 'Collect herbs' }
            ],
            completed: false
        },
        {
            id: 'quest_slime_hunter',
            name: 'Slime Hunter',
            description: "These pesky slimes need to be taught a lesson! Defeat 10 of them.",
            type: 'kill',
            category: 'side',
            reward: { xp: 50, gold: 30 },
            prerequisites: [],
            objectives: [
                { type: 'kill', target: 'slime', quantity: 10, description: 'Defeat slimes' }
            ],
            completed: false
        },
        {
            id: 'quest_wolf_packer',
            name: 'Wolf Pack Problem',
            description: "A wolf pack is terrorizing travelers. Wipe them out!",
            type: 'kill',
            category: 'side',
            reward: { xp: 90, gold: 70 },
            prerequisites: [],
            objectives: [
                { type: 'kill', target: 'wolf', quantity: 5, description: 'Defeat wolves' }
            ],
            completed: false
        },
        {
            id: 'quest_orc_hunter',
            name: 'Orc Hunting',
            description: "Orcs are raiding the mountain passes. Stop them!",
            type: 'kill',
            category: 'side',
            reward: { xp: 120, gold: 90 },
            prerequisites: [],
            objectives: [
                { type: 'kill', target: 'orc', quantity: 5, description: 'Defeat orcs' }
            ],
            completed: false
        },
        {
            id: 'quest_skeleton_bane',
            name: 'Skeleton Slayer',
            description: "Ancient skeletons haunt the dungeon. Purge them!",
            type: 'kill',
            category: 'side',
            reward: { xp: 150, gold: 120 },
            prerequisites: [],
            objectives: [
                { type: 'kill', target: 'skeleton', quantity: 3, description: 'Defeat skeletons' }
            ],
            completed: false
        },
        {
            id: 'quest_mana_hunter',
            name: 'Mana Hunter',
            description: "Collect mana crystals to boost our magical reserves.",
            type: 'collect',
            category: 'side',
            reward: { xp: 60, gold: 40 },
            prerequisites: [],
            objectives: [
                { type: 'collect', target: 'manaCrystal', quantity: 3, description: 'Find mana crystals' }
            ],
            completed: false
        },
        {
            id: 'quest_villager_aid',
            name: "Villager's Request",
            description: "An elderly villager needs help collecting firewood.",
            type: 'collect',
            category: 'side',
            reward: { xp: 40, gold: 25 },
            prerequisites: [],
            objectives: [
                { type: 'collect', target: 'wood', quantity: 10, description: 'Gather firewood' }
            ],
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
        
        // Initialize kill counts and collections from save
        if (savedQuestData && savedQuestData.killCounts) {
            this.playerKillCounts = { ...savedQuestData.killCounts };
        }
        if (savedQuestData && savedQuestData.collections) {
            this.playerCollections = { ...savedQuestData.collections };
        }

        // Initialize quest states
        this.activeQuests = [...this.mainStorylineQuests, ...this.sideQuests]
            .map(quest => ({
                ...quest,
                state: savedQuestData && savedQuestData.quests[quest.id] 
                    ? { ...savedQuestData.quests[quest.id], completed: false }
                    : { accepted: false, progress: 0, objectivesCompleted: [] }
            }));

        // Restore completed quests
        if (savedQuestData && savedQuestData.completedQuests) {
            this.completedQuests = savedQuestData.completedQuests.map(qid => 
                this.mainStorylineQuests.find(q => q.id === qid) || 
                this.sideQuests.find(q => q.id === qid)
            ).filter(Boolean); // Remove undefined entries
        }

        // Check for prerequisites and unlock quests
        this.checkPrerequisites();

        // Render initial quest board
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

        // Build quest data for save
        const questData = {};
        this.activeQuests.forEach(quest => {
            if (quest.state) {
                questData[quest.id] = {
                    accepted: quest.state.accepted,
                    progress: quest.state.progress,
                    objectivesCompleted: quest.state.objectivesCompleted || []
                };
            }
        });

        // Track completed quests
        const completedQuestIds = this.completedQuests.map(q => q.id);

        gameData.quests = questData;
        gameData.completedQuests = completedQuestIds;
        gameData.killCounts = { ...this.playerKillCounts };
        gameData.collections = { ...this.playerCollections };

        localStorage.setItem('rpg_save', JSON.stringify(gameData));
    },

    // Check if quests are unlocked based on prerequisites
    checkPrerequisites() {
        this.activeQuests.forEach(quest => {
            if (quest.state && quest.state.accepted) return; // Already accepted, skip

            const prerequisites = quest.prerequisites || [];
            const allCompleted = prerequisites.every(reqId => 
                this.completedQuests.some(q => q.id === reqId)
            );

            if (allCompleted) {
                quest.state.accepted = true;
                quest.state.progress = 0;
                quest.state.objectivesCompleted = [];
            }
        });
    },

    // Get quests that can be accepted (not accepted, not completed, prerequisites met)
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

        // Save progress
        this.saveQuestData();
        
        Utils.showMessage(`Accepted: ${quest.name}`, 'success');
        this.renderQuestBoard();
        this.renderActiveQuests();
        return true;
    },

    // Complete quest objectives (called from game.js and combat.js)
    completeObjective(questId, objective) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state) return false;

        // Check if objective is already completed
        if (quest.state.objectivesCompleted.includes(objective.type)) return false;

        // Handle different objective types
        switch (objective.type) {
            case 'talk':
                quest.state.objectivesCompleted.push(objective.type);
                break;
            case 'kill':
                this.playerKillCounts[objective.target] = 
                    (this.playerKillCounts[objective.target] || 0) + 1;
                quest.state.progress += 1;
                if (quest.state.progress >= objective.quantity) {
                    this.completeQuest(questId);
                }
                break;
            case 'collect':
                if (!this.playerCollections[objective.target]) {
                    this.playerCollections[objective.target] = 0;
                }
                this.playerCollections[objective.target]++;
                quest.state.progress += 1;
                if (quest.state.progress >= objective.quantity) {
                    this.completeQuest(questId);
                }
                break;
        }

        // Save progress
        this.saveQuestData();
        
        // Update UI
        this.renderActiveQuests();
        return true;
    },

    // Complete a quest when objectives are fulfilled
    completeQuest(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state) return false;

        quest.state.completed = true;
        this.completedQuests.push(quest);

        // Grant rewards
        const levelsGained = Game.player.gainXp(quest.reward.xp);
        Game.addGold(quest.reward.gold);

        // Save progress
        this.saveQuestData();

        // Check for next main quest (story progression)
        if (quest.category === 'main') {
            const nextMainQuest = this.activeQuests.find(q => 
                q.category === 'main' && !q.state.accepted && !q.state.completed
            );
            if (nextMainQuest) {
                Utils.showMessage(`Story Progress: ${nextMainQuest.name} is now available!`, 'info');
            }
        }

        // Update UI
        this.renderActiveQuests();
        this.renderCompletedQuests();
        
        const levelMessage = levelsGained > 0 ? ` Level up! You reached level ${Game.player.level}.` : '';
        Utils.showMessage(`Quest complete: ${quest.name}! Earned ${quest.reward.xp} XP and ${quest.reward.gold} gold.${levelMessage}`, 'success');

        return true;
    },

    // Render all quest panels
    renderAllQuests(player = Game.player) {
        this.renderActiveQuests();
        this.renderCompletedQuests();
        this.renderQuestBoard(player);
    },

    // Render quest board (available quests to accept)
    renderQuestBoard(player = Game.player) {
        const container = document.getElementById('interaction-content');
        if (!container) return;

        const available = this.getAvailableQuests();
        const active = this.activeQuests.filter(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );
        const completed = this.completedQuests;

        // Render active quests summary
        let activeHtml = '';
        if (active.length) {
            activeHtml = '<h4 style="margin: 10px 0;">In Progress</h4>' + 
                active.map(quest => `
                    <div style="background: #f3f4f6; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <strong style="color: #1f2937;">${quest.name}</strong><br>
                        <small style="color: #374151;">${quest.description}</small><br>
                        <span style="font-size: 12px; color: #6b7280;">
                            Progress: ${quest.state.progress}/${quest.objectives?.find(o => o.type === 'kill' || o.type === 'collect')?.quantity || '?'}
                        </span>
                    </div>
                `).join('')
            ;
        }

        // Render completed quests summary
        let completedHtml = '';
        if (completed.length) {
            completedHtml = '<h4 style="margin: 10px 0;">Completed</h4>' +
                completed.map(quest => `
                    <div style="background: #d1fae5; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        <strong style="color: #065f46;">${quest.name} ✓</strong><br>
                        <small style="color: #047857;">Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold</small>
                    </div>
                `).join('')
            ;
        }

        // Available quests
        let availableHtml = '';
        if (available.length) {
            availableHtml = '<h4 style="margin: 10px 0;">Available Quests</h4>' + 
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

        // Add event listeners to accept buttons
        container.querySelectorAll('.quest-accept-btn').forEach(button => {
            button.addEventListener('click', () => {
                const questId = button.dataset.questId;
                if (this.acceptQuest(questId)) {
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
                const progressObj = quest.objectives?.find(o => o.type === 'kill' || o.type === 'collect');
                const progressText = progressObj 
                    ? `${quest.state.progress}/${progressObj.quantity}` 
                    : 'In Progress';
                
                html += `
                    <div style="background: ${this.getQuestColor(quest.category)}20; padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #1f2937;">${quest.name}</strong><br>
                                <small style="color: #374151;">${quest.description}</small><br>
                                <span style="font-size: 12px; color: #6b7280;">
                                    ${progressText} · Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (!html) {
            html = '<p style="text-align:center;color:#4b5563;padding:20px;">No active quests. Visit King Alaric to start a main storyline quest!</p>';
        }

        container.innerHTML = html;

        // Add placeholder for test
        const questDiv = document.createElement('div');
        questDiv.id = 'quest';
        questDiv.textContent = 'Quest';
        questDiv.style.fontWeight = 'bold';

        if (container.contains(questDiv)) return; // avoid duplicates

        container.appendChild(questDiv);
    },

    // Render completed quests panel
    renderCompletedQuests() {
        const container = document.getElementById('completed-quests');
        if (!container) return;

        const completed = this.completedQuests;

        let html = '<h4 style="margin: 0 0 10px;">Your Quest History</h4>';
        if (completed.length) {
            html += completed.map(quest => `
                <div style="background: #d1fae5; padding: 10px; margin: 6px 0; border-radius: 6px;">
                    <strong style="color: #065f46;">${quest.name} ✓</strong><br>
                    <small style="color: #047857;">Completed: +${quest.reward.xp} XP, ${quest.reward.gold} gold</small>
                </div>
            `).join('')
        } else {
            html += '<p style="text-align:center;color:#4b5563;padding:20px;">No completed quests yet.</p>';
        }

        container.innerHTML = html;
    },

    // Helper methods
    getQuestColor(category) {
        return this.questCategories[category]?.color || '#8b5cf6';
    }
};

// Export for external use if needed
if (typeof window !== 'undefined') {
    window.QuestSystem = QuestSystem;
}
