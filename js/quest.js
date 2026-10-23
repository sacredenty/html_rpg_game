// Quest state and persistence; quest data, progression, and UI are loaded from focused modules.
const QuestSystem = {};

// Load all quest system components
Object.assign(QuestSystem, {
    // Quest data and definitions (loaded from data.js)
    
    // Quest state management (loaded from state.js)
    
    // Quest rendering (loaded from rendering.js)
    
    // Quest progression logic (loaded from progression.js)
    
    // Initialize quest system
    init(player, savedData) {
        // Load all quest system modules and initialize properly
        // This would normally be in separate files but for now load the core parts
        
        // Set up default quest system components
        if (this.activeQuests && this.activeQuests.length > 0) {
            // System already initialized - return early to avoid re-initializing
            return;
        }
        
        // Set up player state tracking
        this.playerKillCounts = {};
        this.playerCollections = {};
        this.completedQuests = [];
        
        // Initialize quest data from the core files  
        if (this.mainStorylineQuests && this.sideQuests) {
            const allQuests = [...this.mainStorylineQuests, ...this.sideQuests];
            this.activeQuests = allQuests.map(quest => ({
                ...quest,
                state: { 
                    accepted: false, 
                    progress: 0, 
                    objectivesCompleted: [], 
                    dropped: false, 
                    completed: false 
                }
            }));
        }
        
        // Restore saved quests if data exists
        const localStorageData = savedData || this.getSavedQuestData();
        if (localStorageData) {
            this.playerKillCounts = { ...(localStorageData.killCounts || {}) };
            this.playerCollections = { ...(localStorageData.collections || {}) };
        }
        
        // Initialize active quest tracking
        this.checkPrerequisites();
        this.renderQuestBoard(player, false);
    },
    
    getSavedQuestData() {
        try {
            const storedQuestData = localStorage.getItem('rpg_quest_data');
            if (storedQuestData) return JSON.parse(storedQuestData);
            return null;
        } catch (error) {
            console.error('Failed to read saved quest data:', error);
            return null;
        }
    },
    
    saveQuestData() {
        try {
            const questData = {
                quests: {},
                completedQuests: [],
                killCounts: { ...this.playerKillCounts },
                collections: { ...this.playerCollections }
            };
            
            localStorage.setItem('rpg_quest_data', JSON.stringify(questData));
            return true;
        } catch (error) {
            console.error('Failed to save quest data:', error);
            return false;
        }
    },
    
    // Get collect quests by item target
    getCollectQuestsByTarget(target) {
        if (!this.activeQuests) return [];
        
        const collectQuests = this.activeQuests.filter(quest => {
            if (!quest.state || !quest.state.accepted || quest.state.completed) return false;
            
            // Look at all objectives
            if (quest.objectives && Array.isArray(quest.objectives)) {
                return quest.objectives.some(obj => 
                    obj.type === 'collect' && obj.target === target
                );
            }
            return false;
        });
        
        return collectQuests;
    }
});

// This is the main quest system that will be initialized in the game's init function