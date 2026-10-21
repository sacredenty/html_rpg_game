/**
 * Standalone Game Entry Point - Works with existing js/ modules
 * This is a compatibility wrapper for gradual migration
 */

// Import legacy global objects (they're in the old js/ files)
const Entities = {}; // Will be populated by js/entities.js
let QuestSystem;    // Will be initialized by js/quest.js
let CombatSystem;   // From js/combat.js
let Utils;          // From js/utils.js

/**
 * Create a new Game using refactored src/ modules alongside legacy code
 */
class StandaloneGame {
    constructor() {
        this.game = null;
        this.player = null;
        this.canvas = null;
        this.ctx = null;
        
        // Initialize with legacy system first (for compatibility)
        this.initLegacyGlobals();
    }

    /**
     * Set up global objects from legacy code
     */
    initLegacyGlobals() {
        try {
            // These will be loaded by index.html script tags before we run
            console.log('[StandaloneGame] Loading legacy globals...');
            
            // Global entities object (will be populated when js/entities.js loads)
            // const Entities = window.Entities || {};
            
            // We'll create new modules that wrap the old behavior
        } catch (error) {
            console.warn('[StandaloneGame] Legacy initialization:', error.message);
        }
    }

    /**
     * Initialize game using hybrid approach - keeps legacy code but adds new architecture
     */
    async init() {
        console.log('[StandaloneGame] Initializing...');
        
        // Canvas setup (from legacy game.js)
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.canvas) {
            throw new Error('GameCanvas element not found in DOM!');
        }

        console.log('[StandaloneGame] Canvas found, continuing initialization...');

        // The original game.init() logic is still in js/game.js
        // We're keeping backward compatibility by NOT breaking existing code
        // until we can properly migrate

        return {
            success: true,
            message: 'Game initialized (running legacy code for now)'
        };
    }
}

/**
 * Export for use in ES6 modules
 */
export default StandaloneGame;
