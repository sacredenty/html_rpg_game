/**
 * QuestSystem - Handles quest tracking, rewards, and quest completion
 */

class QuestSystem {
    constructor(game) {
        this.game = game;
        this.player = null;
        
        // Quest database
        this.quests = {};
        
        // Current active quests for player
        this.activeQuests = [];
        
        // Completed quests tracking
        this.completedQuests = [];
        
        // Bind methods
        this.completeQuest = this.completeQuest.bind(this);
        this.update = this.update.bind(this);
    }

    /**
     * Initialize quest system with player reference
     */
    init(player, game) {
        this.player = player;
        this.game = game;
        
        // Register available quests
        this.registerQuest('meetKing');
        this.registerQuest('collectHealingHerbs');
        this.registerQuest('collectHealthPotions');
        this.registerQuest('defeatSlimes');
        this.registerQuest('defeatGoblins');
        this.registerQuest('defeatWolves');
        this.registerQuest('defeatOrcs');
        this.registerQuest('defeatSkeletons');
        this.registerQuest('defeatDragon');
        
        console.log('[QuestSystem] Initialized with player and game');
    }

    /**
     * Register a new quest type
     */
    registerQuest(questId) {
        const questData = this.getDefaultQuest(questId);
        this.quests[questId] = questData;
        
        console.log(`[QuestSystem] Registered quest: ${questId}`);
    }

    /**
     * Get default quest configuration
     */
    getDefaultQuest(questId) {
        const quests = {
            meetKing: {
                id: 'meetKing',
                title: 'Meet the King',
                description: 'Find and speak with the King in the village.',
                objective: 'npc_interactions',
                targetObjectives: [
                    {
                        type: 'npc',
                        targetType: 'king',
                        current: 0,
                        required: 1
                    }
                ],
                rewardXp: 50,
                rewardGold: 25,
                completed: false,
                available: true
            },
            collectHealingHerbs: {
                id: 'collectHealingHerbs',
                title: 'Gather Healing Herbs',
                description: 'Collect 10 healing herbs from the forest.',
                objective: 'collect_items',
                targetObjectives: [
                    {
                        type: 'item',
                        targetType: 'healingHerb',
                        current: 0,
                        required: 10
                    }
                ],
                rewardXp: 100,
                rewardGold: 50
            },
            collectHealthPotions: {
                id: 'collectHealthPotions',
                title: 'Gather Health Potions',
                description: 'Collect 5 health potions for the supply line.',
                objective: 'collect_items',
                targetObjectives: [
                    {
                        type: 'item',
                        targetType: 'healthPotion',
                        current: 0,
                        required: 5
                    }
                ],
                rewardXp: 100,
                rewardGold: 50
            },
            defeatSlimes: {
                id: 'defeatSlimes',
                title: 'Clear the Slime Infestation',
                description: 'Defeat 10 slimes in your first combat trial.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'slime',
                        current: 0,
                        required: 10
                    }
                ],
                rewardXp: 200,
                rewardGold: 100
            },
            defeatGoblins: {
                id: 'defeatGoblins',
                title: 'Eliminate the Goblin Threat',
                description: 'Defeat 3 goblins to clear this area.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'goblin',
                        current: 0,
                        required: 3
                    }
                ],
                rewardXp: 250,
                rewardGold: 120
            },
            defeatWolves: {
                id: 'defeatWolves',
                title: 'Drive Away the Wolves',
                description: 'Defeat 3 wolves guarding the mountain pass.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'wolf',
                        current: 0,
                        required: 3
                    }
                ],
                rewardXp: 300,
                rewardGold: 150
            },
            defeatOrcs: {
                id: 'defeatOrcs',
                title: 'Defend the Settlement',
                description: 'Defeat 3 orcs attacking your settlement.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'orc',
                        current: 0,
                        required: 3
                    }
                ],
                rewardXp: 400,
                rewardGold: 200
            },
            defeatSkeletons: {
                id: 'defeatSkeletons',
                title: 'Clear the Dungeon Entrance',
                description: 'Defeat 2 skeletons blocking your path.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'skeleton',
                        current: 0,
                        required: 2
                    }
                ],
                rewardXp: 450,
                rewardGold: 225
            },
            defeatDragon: {
                id: 'defeatDragon',
                title: 'Defeat the Dragon',
                description: 'The ultimate challenge - slay the dragon guarding the treasure.',
                objective: 'defeat_monsters',
                targetObjectives: [
                    {
                        type: 'monster',
                        targetType: 'dragon',
                        current: 0,
                        required: 1
                    }
                ],
                rewardXp: 5000,
                rewardGold: 1000,
                isFinalBoss: true
            }
        };
        
        return quests[questId] || null;
    }

    /**
     * Track objective completion
     */
    updateObjective(questId, targetType) {
        if (!this.quests[questId]) {
            console.warn(`[QuestSystem] Quest ${questId} not found`);
            return false;
        }

        const quest = this.quests[questId];
        const objectiveIndex = quest.targetObjectives.findIndex(o => o.type === quest.objective);

        if (objectiveIndex > -1) {
            const obj = quest.targetObjectives[objectiveIndex];
            
            // Find and mark target as completed
            const matchIndex = [...this.game.monsters, ...this.game.items].findIndex(e => 
                e.alive && e.type === targetType
            );

            if (matchIndex > -1) {
                quest.targetObjectives[objectiveIndex].current++;
                
                // Check if objective is complete
                if (quest.targetObjectives[objectiveIndex].current >= quest.targetObjectives[objectiveIndex].required) {
                    this.completeQuest(questId);
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Complete a quest
     */
    completeQuest(questId) {
        if (!this.quests[questId]) return false;

        const quest = this.quests[questId];
        
        // Mark as completed
        quest.completed = true;
        quest.available = false;
        
        // Add to completed quests history
        this.completedQuests.push({
            questId: questId,
            title: quest.title,
            completedAt: Date.now(),
            rewardXp: quest.rewardXp,
            rewardGold: quest.rewardGold
        });
        
        // Apply rewards
        if (this.player) {
            this.player.gainXp(quest.rewardXp);
            
            if (this.game && typeof this.game.addGold === 'function') {
                this.game.addGold(quest.rewardGold);
            }
        }
        
        console.log(`[QuestSystem] Quest completed: ${quest.title}`);

        return true;
    }

    /**
     * Update quest system every frame
     */
    update(player, game) {
        // Check for new quests available to the player
        this.checkQuestAvailability(player, game);
        
        // Update quest tracking (progress)
        this.trackProgress();
    }

    /**
     * Check what quests are available to player based on their progress
     */
    checkQuestAvailability(player, game) {
        const completedQuests = this.completedQuests.map(q => q.questId);
        
        // Simple availability logic - in full version this would be more complex
        if (player.level < 5) {
            return; // Player hasn't progressed far enough for new quests
        }
    }

    /**
     * Get active quests for player (those they can currently work on)
     */
    getActiveQuests() {
        return Object.values(this.quests).filter(q => !q.completed);
    }

    /**
     * Get completed quests history
     */
    getCompletedQuests() {
        return [...this.completedQuests];
    }

    /**
     * Serialize quest system state for saving
     */
    toJSON() {
        return {
            activeQuests: this.getActiveQuests().map(q => q.id),
            completedQuests: this.completedQuests.map(cq => ({
                questId: cq.questId,
                title: cq.title,
                rewardXp: cq.rewardXp,
                rewardGold: cq.rewardGold,
                completedAt: cq.completedAt
            })),
            questProgress: Object.values(this.quests).map(q => ({
                questId: q.id,
                progress: q.targetObjectives.reduce((acc, obj) => acc + obj.current, 0),
                completed: q.completed
            }))
        };
    }
}

export default QuestSystem;
