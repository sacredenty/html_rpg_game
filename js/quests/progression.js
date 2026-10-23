// Progression
Object.assign(QuestSystem, {
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
            !quest.state.completed &&
            (!quest.prerequisites || quest.prerequisites.every(reqId => 
                this.completedQuests.some(q => q.id === reqId)
            ))
        );
    },

    // Accept a quest

    acceptQuest(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state || !this.getAvailableQuests().includes(quest)) return false;

        quest.state.accepted = true;
        quest.state.dropped = false;
        quest.state.progress = 0;
        quest.state.objectivesCompleted = [];
        
        this.saveQuestData();
        this.renderQuestBoard(Game.player, this.isQuestGiverPanelOpen());
        
        return true;
    },

    // Drop an accepted quest (only if not completed)

    dropQuest(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state || !quest.state.accepted) return false;

        // Cannot drop completed quests
        if (quest.state.completed) {
            console.log(`Cannot drop completed quest: ${quest.name}`);
            return false;
        }

        // Mark quest as dropped
        quest.state.dropped = true;
        quest.state.accepted = false;
        
        this.saveQuestData();
        this.renderQuestBoard(Game.player, this.isQuestGiverPanelOpen());
        
        return true;
    },

    isQuestGiverPanelOpen() {
        const panel = document.getElementById('interaction-panel');
        return Boolean(panel && !panel.hidden && panel.dataset.type === 'quests');
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

    completeObjective(questId, objective) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.state || quest.state.completed) return false;

        if (objective.type === 'kill') {
            this.playerKillCounts[objective.target] = (this.playerKillCounts[objective.target] || 0) + 1;
        } else if (objective.type === 'collect') {
            this.playerCollections[objective.target] = (this.playerCollections[objective.target] || 0) + 1;
        }

        const objectiveData = quest.objectives.find(obj => obj.type === objective.type && obj.target === objective.target);
        if (!objectiveData) return false;

        const targetCount = objectiveData.quantity || 1;
        
        if ((objective.type === 'kill' && this.playerKillCounts[objective.target] >= targetCount) || 
            (objective.type === 'collect' && this.playerCollections[objective.target] >= targetCount)) {
            
            if (!quest.state.objectivesCompleted.includes(objective.type)) {
                quest.state.objectivesCompleted.push(objective.type);
                
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
            // Find the quest in the active quests list to update it properly
            const questIndex = this.activeQuests.findIndex(q => q.id === quest.id);
            if (questIndex !== -1) {
                this.activeQuests[questIndex] = quest;
                this.completedQuests.push(quest);
                if (quest.category === 'main') {
                    this.checkPrerequisites();
                }
                this.saveQuestData();
                this.renderQuestBoard(Game.player, this.isQuestGiverPanelOpen());

                const container = document.getElementById('interaction-content');
                if (container) {
                    const rewardText = `You've completed "${quest.name}"! Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold`;
                    container.innerHTML += `<p style="color: #fbbf24; font-weight: bold; margin-top: 15px;">🎉 ${rewardText}</p>`;
                }
            }
        }

        return allComplete;
    },

    // Get kill quests by monster target

    getKillQuestsByTarget(target) {
        if (!this.activeQuests) return [];
        
        const killQuests = this.activeQuests.filter(quest => {
            if (!quest.state || !quest.state.accepted || quest.state.completed) return false;
            
            // Look at all objectives
            if (quest.objectives && Array.isArray(quest.objectives)) {
                return quest.objectives.some(obj => 
                    obj.type === 'kill' && obj.target === target
                );
            }
            return false;
        });
        
        return killQuests;
    },

    // Get quest color based on category

    getQuestColor(category) {
        return this.questCategories[category]?.color || '#9ca3af';
    },

    getAvailableQuestCount() {
        return this.getAvailableQuests().length;
    },

    // Check if player has any accepted quests

    hasActiveQuests() {
        return this.activeQuests.some(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );
    }
});
