// State
Object.assign(QuestSystem, {
    activeQuests: [],

    completedQuests: [],

    playerKillCounts: {},

    playerCollections: {},

    // Initialize quest system

    init(player, savedQuestData) {
        const data = savedQuestData === undefined ? this.getSavedQuestData() : savedQuestData;
        const completedQuestIds = new Set(data?.completedQuests || []);
        this.playerKillCounts = { ...(data?.killCounts || {}) };
        this.playerCollections = { ...(data?.collections || {}) };

        this.activeQuests = [...this.mainStorylineQuests, ...this.sideQuests].map(quest => {
            const savedState = data?.quests?.[quest.id];
            const state = savedState
                ? {
                    ...savedState,
                    completed: Boolean(savedState.completed || completedQuestIds.has(quest.id)),
                    objectivesCompleted: Array.isArray(savedState.objectivesCompleted)
                        ? [...savedState.objectivesCompleted]
                        : []
                }
                : { accepted: false, progress: 0, objectivesCompleted: [], dropped: false, completed: false };
            return { ...quest, state };
        });
        this.completedQuests = this.activeQuests.filter(quest => quest.state.completed);

        this.checkPrerequisites();
        this.renderQuestBoard(player, false);
    },

    // Get saved quest data from localStorage

    getSavedQuestData() {
        try {
            const storedQuestData = localStorage.getItem('rpg_quest_data');
            if (storedQuestData) return JSON.parse(storedQuestData);
            return this.getLegacySavedQuestData();
        } catch (error) {
            console.error('Failed to read saved quest data:', error);
            return null;
        }
    },

    getLegacySavedQuestData() {
        const legacySave = localStorage.getItem('rpg_save');
        if (!legacySave) return null;
        try {
            const data = JSON.parse(legacySave);
            return data.questData || (data.quests ? data : null);
        } catch (error) {
            console.error('Failed to read legacy quest data:', error);
            return null;
        }
    },

    // Save quest progress to localStorage

    saveQuestData() {
        const questData = this.serialize();
        const slot = Game.currentSaveSlot;
        const saveKey = Number.isInteger(slot) ? Game.saveSlotKey(slot) : null;
        try {
            if (saveKey) {
                const currentSave = localStorage.getItem(saveKey);
                if (currentSave) {
                    const gameData = JSON.parse(currentSave);
                    gameData.questData = questData;
                    localStorage.setItem(saveKey, JSON.stringify(gameData));
                } else {
                    localStorage.setItem('rpg_quest_data', JSON.stringify(questData));
                }
            } else {
                localStorage.setItem('rpg_quest_data', JSON.stringify(questData));
            }
        } catch (error) {
            console.error('Failed to save quest data:', error);
            Utils.showMessage('Unable to save quest progress. Browser storage may be unavailable or full.', 'error');
            return false;
        }
        return true;
    },

    serialize() {
        const questData = {};
        this.activeQuests.forEach(quest => {
            if (quest.state) {
                questData[quest.id] = {
                    accepted: quest.state.accepted,
                    progress: quest.state.progress,
                    objectivesCompleted: quest.state.objectivesCompleted || [],
                    dropped: quest.state.dropped,
                    completed: quest.state.completed
                };
            }
        });

        return {
            quests: questData,
            completedQuests: this.activeQuests
                .filter(quest => quest.state?.completed)
                .map(quest => quest.id),
            killCounts: { ...this.playerKillCounts },
            collections: { ...this.playerCollections }
        };
    },

});
