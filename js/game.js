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
        sword: 80,
        shield: 55,
        steelShield: 120,
        leatherArmor: 70,
        chainmail: 160,
        goldRing: 100,
        silverRing: 180,
        luckyCharm: 130
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
    
    if (roll < 1) return 'darkLord';     // 1% - ultra rare boss drop
    if (roll < 2) return 'shadowKnight'; // 1% - very rare elite
    if (roll < 3) return 'iceDragon';    // 1% - very rare elite  
    if (roll < 4) return 'fireDrake';    // 1% - very rare elite
    if (roll < 5) return 'dragon';       // 5% - uncommon boss
    if (roll < 70) return 'skeleton';     // 20% - uncommon enemy
    if (roll < 80) return 'orc';          // 10% - common enemy
    if (roll < 90) return 'goblin';       // 10% - common enemy
    return 'slime';                       // 10% - very common
}

function getRandomEquipmentType() {
    const types = [
        'sword', 'shield', 'steelShield', 'leatherArmor', 'chainmail',
        'goldRing', 'silverRing', 'luckyCharm'
    ];
    return types[Utils.random(0, types.length - 1)];
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
