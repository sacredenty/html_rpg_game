// Data
Object.assign(QuestSystem, {
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
        },
        {
            id: 'quest_fire_draught',
            name: "Fire Draught",
            description: "A fire drake has been spotted in the volcanic regions! Bring the realm back from its heat.",
            type: 'kill', category: 'main',
            reward: { xp: 700, gold: 400 },
            prerequisites: ['quest_dragon_slayer'],
            objectives: [{ type: 'kill', target: 'fireDrake', quantity: 1, description: 'Defeat the Fire Drake' }],
            completed: false
        },
        {
            id: 'quest_frozen_peaks',
            name: "Frozen Peaks",
            description: "The ice dragon has frozen a mountain valley! Free the people before it spreads.",
            type: 'kill', category: 'main',
            reward: { xp: 750, gold: 450 },
            prerequisites: ['quest_fire_draught'],
            objectives: [{ type: 'kill', target: 'iceDragon', quantity: 1, description: 'Defeat the Ice Dragon' }],
            completed: false
        },
        {
            id: 'quest_shadow_fall',
            name: "Shadow Fall",
            description: "Ancient shadows have taken possession of a knight! Banish it before it corrupts more souls.",
            type: 'kill', category: 'main',
            reward: { xp: 800, gold: 500 },
            prerequisites: ['quest_frozen_peaks'],
            objectives: [{ type: 'kill', target: 'shadowKnight', quantity: 1, description: 'Defeat the Shadow Knight' }],
            completed: false
        },
        {
            id: 'quest_dark_lord_final',
            name: "Dark Lord's End",
            description: "The dark lord stands before you! This final battle will determine the fate of our world.",
            type: 'kill', category: 'main',
            reward: { xp: 1000, gold: 750 },
            prerequisites: ['quest_shadow_fall'],
            objectives: [{ type: 'kill', target: 'darkLord', quantity: 1, description: 'Defeat the Dark Lord' }],
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
        },
        {
            id: 'quest_fire_watcher',
            name: "Fire Watcher's Challenge",
            description: "An old fire watcher challenges you to defeat a drake as proof of your worthiness.",
            type: 'kill', category: 'side',
            reward: { xp: 400, gold: 200 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'fireDrake', quantity: 1, description: 'Defeat a drake' }],
            completed: false
        },
        {
            id: 'quest_mage_challenge',
            name: "Mage Challenge",
            description: "A mysterious mage challenges you to test your magical prowess against an ice dragon.",
            type: 'kill', category: 'side',
            reward: { xp: 350, gold: 200 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'iceDragon', quantity: 1, description: 'Defeat an ice dragon' }],
            completed: false
        },
        {
            id: 'quest_paladin_challenge',
            name: "Paladin Challenge",
            description: "A fallen paladin seeks redemption through victory over shadow magic.",
            type: 'kill', category: 'side',
            reward: { xp: 400, gold: 200 },
            prerequisites: [],
            objectives: [{ type: 'kill', target: 'shadowKnight', quantity: 1, description: 'Defeat a shadow knight' }],
            completed: false
        }
    ],

});
