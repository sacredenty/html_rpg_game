/**
 * Main - Entry point for the refactored game
 * Initializes all systems and starts the game loop
 */

import GameState from './GameState.js';
import GameLoop from './GameLoop.js';

// Import entity systems
import Player from '../entities/Player.js';
import Monster from '../entities/Monster.js';

// Import UI components
import HUD from '../ui/HUD.js';

// Import input handlers
import Keyboard from '../input/Keyboard.js';
// Mouse import will go here when implemented

// Import systems
import CombatSystem from '../systems/CombatSystem.js';
import QuestSystem from '../systems/QuestSystem.js';

// Simple module pattern for backward compatibility with global Game object
const MainGame = {
    game: null,
    player: null,
    canvas: null,
    ctx: null,
    
    /**
     * Initialize the main game instance
     */
    init() {
        console.log('[Main] Initializing refactored game...');
        
        // Setup canvas (assuming it exists in DOM)
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('[Main] GameCanvas element not found!');
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d');
        GameState.setState(GameState.START);
        
        // Create player
        const playerClass = 'warrior';
        this.player = new Player('Hero', playerClass);
        playerClass === 'mage' ? console.log('[Main] Mage selected') : null;
        playerClass === 'ranger' ? console.log('[Main] Ranger selected') : null;
        
        // Initialize systems
        const gameSystems = {
            combatSystem: new CombatSystem(this),
            questSystem: new QuestSystem(this)
        };
        
        // Attach systems to player
        this.player.allowedSpells.push(...gameSystems.questSystem.quests.defeatSlimes ? [] : []);
        
        // Initialize HUD
        const hud = new HUD(this);
        hud.attachPlayer(this.player);
        
        // Setup input handlers
        this.inputHandler = {
            keyboard: new Keyboard(),
            mouse: null // TODO: Implement Mouse handler
        };
        this.inputHandler.keyboard.attachListeners();
        
        // Create game loop
        const gameLoop = new GameLoop(this);
        
        // Initialize world and start
        this.initializeWorld();
        
        // Start game loop
        gameLoop.start();
        
        console.log('[Main] Game initialized successfully!');
        return true;
    },

    /**
     * Create the initial world map
     */
    initializeWorld() {
        console.log('[Main] Initializing world...');
        
        // Initialize QuestSystem with player and game
        this.questSystem = new QuestSystem(this);
        this.questSystem.init(this.player, this);
        
        console.log('[Main] World initialized! Ready to start.');
    }
};

// Export for use as module or global reference (backward compatibility)
const Game = MainGame;

// Make available globally if in browser context
if (typeof window !== 'undefined') {
    window.Game = Game;
}

export default Game;
