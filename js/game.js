// Main Game Logic for RPG Adventure

// Feature scripts extend this object before the DOM-ready initialization runs.
const Game = {
    canvas: null,
    ctx: null,
    TILE_SIZE: 40,
    CHUNK_WIDTH: 38,
    CHUNK_HEIGHT: 22,
    
    // Game world
    width: 50,
    height: 30,
    viewWidth: 38,
    viewHeight: 22,
    cameraX: 0,
    cameraY: 0,
    map: [],
    player: null,
    
    // Entities
    monsters: [],
    items: [],
    npcs: [],
    shopStock: {
        healthPotion: 12,
        healingHerb: 5,
        manaPotion: 10,

        // Weapons
        sword: 80,
        legendarySword: 400,
        darkLordsSword: 800,

        // Shields
        shield: 55,
        steelShield: 120,

        // Armor
        leatherArmor: 70,
        chainmail: 160,

        // Helmets (NEW)
        helmet: 45,
        steelHelmet: 95,

        // Boots (NEW)
        boots: 35,
        steelBoots: 75,

        // Amulets (NEW)
        amulet: 60,
        rubyAmulet: 120,

        // Staffs (NEW - Mage only)
        staff: 85,
        crystalStaff: 180,

        // Accessories
        goldRing: 100,
        silverRing: 180,
        luckyCharm: 130,

        // Boss Drops
        fireCrystal: 250,
        iceShard: 250,
        shadowShard: 220,
        darkLordsHeart: 1000
    },
    
    // Current biome
    currentBiome: Entities.Biomes.forest,
    
    // Game state
    gameState: 'start', // start, playing, gameover
    difficulty: 'medium',
    difficultySettings: {
        easy: { label: 'Easy', monsterDamageMultiplier: 0.7, goldMultiplier: 1.25 },
        medium: { label: 'Medium', monsterDamageMultiplier: 1, goldMultiplier: 1 },
        hard: { label: 'Hard', monsterDamageMultiplier: 1.5, goldMultiplier: 1.5 }
    },
    characterCreationStep: 0,
    currentSaveSlot: null,
    saveSlotMode: 'load',
    saveSlotReturnToStartup: false,

    getDifficultySettings() {
        return Object.hasOwn(this.difficultySettings, this.difficulty)
            ? this.difficultySettings[this.difficulty]
            : this.difficultySettings.medium;
    },

    updateDifficultyDisplay() {
        document.getElementById('difficulty-display').textContent = this.getDifficultySettings().label;
    },
    
    // Initialize the game
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Keep the viewport fixed while the explored world expands.
        this.width = 38;
        this.height = 22;
        this.viewWidth = this.width;
        this.viewHeight = this.height;
        this.canvas.width = this.viewWidth * this.TILE_SIZE;
        this.canvas.height = this.viewHeight * this.TILE_SIZE;
        
        // Create player
        this.player = new Entities.Player('Hero');
        this.player.updateStatsDisplay();
        this.updateGoldDisplay();
        
        // Initialize quest system
        QuestSystem.init(this.player);
        
        // Generate initial world
        this.generateWorld();
        this.updateCamera();
        
        // Render initial state
        this.render();
        
        // Setup event listeners
        this.setupEventListeners();
        this.updateStartupAvailability();
        document.getElementById('startup-menu').showModal();
    },
};

function getRandomMonster() {
    // Weighted random monster selection (common: small chance, rare bosses have low chance)
    const roll = Math.random() * 100;
    
    if (roll < 1.5) return 'darkLord';     // 1.5% - ultra rare boss drop
    if (roll < 3) return 'shadowKnight';   // 1.5% - very rare elite
    if (roll < 4.5) return 'iceDragon';    // 1.5% - very rare elite  
    if (roll < 6) return 'fireDrake';      // 1.5% - very rare elite
    if (roll < 8) return 'dragon';         // 2% - uncommon boss
    if (roll < 13) return 'golem';         // 5% - new tanky enemy
    if (roll < 18) return 'wraith';        // 5% - new dangerous enemy
    if (roll < 23) return 'zombie';        // 5% - new regenerating enemy
    if (roll < 28) return 'bat';           // 5% - new fast enemy
    if (roll < 33) return 'spider';        // 5% - new poison enemy
    if (roll < 48) return 'skeleton';      // 15% - uncommon enemy
    if (roll < 60) return 'orc';           // 12% - common enemy
    if (roll < 73) return 'goblin';        // 13% - common enemy
    return 'slime';                        // 27% - very common
}

function getRandomEquipmentType() {
    const types = [
        'sword', 'legendarySword', 'darkLordsSword',
        'shield', 'steelShield',
        'leatherArmor', 'chainmail',
        'helmet', 'steelHelmet',  // NEW
        'boots', 'steelBoots',     // NEW
        'amulet', 'rubyAmulet',    // NEW
        'staff', 'crystalStaff',   // NEW - Mage only
        'goldRing', 'silverRing', 'luckyCharm'
    ];
    return types[Utils.random(0, types.length - 1)];
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
