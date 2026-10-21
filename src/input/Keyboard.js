/**
 * Keyboard - Keyboard input handling
 */

class Keyboard {
    constructor() {
        this.keys = {};
        
        // Bind event handlers
        this.onKeyDown = this.handleKeyDown.bind(this);
        this.onKeyUp = this.handleKeyUp.bind(this);
        
        // Key mappings for game actions
        this.keyMappings = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right',
            w: 'up',
            s: 'down',
            a: 'left',
            d: 'right',
            i: 'interact', // Use items/cast spells
            e: 'inspect'
        };
    }

    /**
     * Handle keyboard key press
     */
    handleKeyDown(event) {
        const key = event.key;
        
        // Track key state
        this.keys[key] = true;
        
        // Process mapped actions
        if (this.keyMappings.hasOwnProperty(key)) {
            const action = this.keyMappings[key];
            
            // Emit input event for game to process
            InputHandler?.emit('keyDown', {
                key: key,
                action: action,
                timestamp: Date.now()
            });
        }
        
        // Special key handling
        if (key === 'Escape') {
            this.keys[key] = true; // Prevent immediate release
            console.log('[Keyboard] ESC pressed - showing menu?');
            
            // If there's a UI to toggle
            GameUI?.toggleMainMenu();
        }
    }

    /**
     * Handle keyboard key release
     */
    handleKeyUp(event) {
        const key = event.key;
        
        // Remove from keys state
        if (this.keys.hasOwnProperty(key)) {
            delete this.keys[key];
        }
        
        InputHandler?.emit('keyUp', {
            key: key,
            timestamp: Date.now()
        });
    }

    /**
     * Get currently pressed keys as a string
     */
    getPressedKeys() {
        return Object.keys(this.keys).filter(k => k.length === 1); // Ignore modifiers
    }

    /**
     * Check if a key is currently pressed
     */
    isKeyPressed(key) {
        return this.keys[key] !== undefined && this.keys[key];
    }

    /**
     * Set up keyboard listeners on DOM
     */
    attachListeners() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        console.log('[Keyboard] Attached to window events');
    }

    /**
     * Remove keyboard listeners
     */
    detachListeners() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        
        console.log('[Keyboard] Detached from window events');
    }

    /**
     * Process a single key input and return suggested action
     */
    processInput() {
        if (!this.keys.ArrowUp && !this.keys.ArrowDown && 
            !this.keys.ArrowLeft && !this.keys.ArrowRight &&
            !this.keys.w && !this.keys.s && !this.keys.a && !this.keys.d) {
            return null; // No movement key pressed
        }

        const dx = this.keys.ArrowLeft || this.keys.a ? -1 : 
                   this.keys.ArrowRight || this.keys.d ? 1 : 0;
        const dy = this.keys.ArrowUp || this.keys.w ? -1 : 
                   this.keys.ArrowDown || this.keys.s ? 1 : 0;

        return {
            dx,
            dy,
            keys: this.getPressedKeys()
        };
    }

    /**
     * Cleanup function
     */
    cleanup() {
        this.detachListeners();
        this.keys = {};
    }
}

export default Keyboard;
