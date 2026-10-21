/**
 * GameLoop - Core game loop controller
 * Manages the main game loop with update and render phases
 */

class GameLoop {
    constructor(game) {
        this.game = game;
        this.updateInterval = null;
        this.isPlaying = false;
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const fps = 60;
        const interval = 1000 / fps;
        
        this.updateInterval = setInterval(() => {
            if (!this.game || !this.game.initComplete) return;
            
            // Update game state (not rendered entities yet)
            this.update();
            this.draw();
        }, interval);
    }

    /**
     * Stop the game loop
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isPlaying = false;
    }

    /**
     * Update game state
     */
    update() {
        if (!this.game) return;
        
        // Process input
        this.processInput();
        
        // Handle camera tracking
        if (this.game.player && this.game.initComplete) {
            this.game.updateCamera();
        }
        
        // Update active quests if any
        this.updateQuests();
    }

    /**
     * Draw game state to canvas
     */
    draw() {
        if (!this.game || !this.game.initComplete) return;
        
        // Render the world
        this.game.render();
    }

    /**
     * Process player input
     */
    processInput() {
        if (!this.game || !this.game.player) return;
        
        const input = InputHandler.getLatestInput();
        if (input?.direction) {
            const direction = input.direction.toLowerCase();
            let dx = 0, dy = 0;
            
            switch (direction) {
                case 'up':
                    this.moveEntity(this.game.player, 0, -1);
                    break;
                case 'down':
                    this.moveEntity(this.game.player, 0, 1);
                    break;
                case 'left':
                    this.moveEntity(this.game.player, -1, 0);
                    break;
                case 'right':
                    this.moveEntity(this.game.player, 1, 0);
                    break;
            }
        }
    }

    /**
     * Attempt to move entity
     */
    moveEntity(entity, dx, dy) {
        if (!entity || !this.game) return false;
        
        const newX = entity.x + dx;
        const newY = entity.y + dy;
        
        if (this.game.isMoveAllowed(entity, newX, newY)) {
            this.game.moveEntity(entity, newX, newY);
            return true;
        }
        return false;
    }

    /**
     * Update active quests
     */
    updateQuests() {
        if (!this.game || !QuestSystem.instance) return;
        
        QuestSystem.instance.update(this.game.player, this.game);
    }

    /**
     * Cleanup when game ends
     */
    cleanup() {
        this.stop();
        // Clear any timers or listeners
    }
}

export default new GameLoop({});
