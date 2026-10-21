/**
 * InputHandler - Unified input handling combining keyboard and mouse inputs
 */

import Keyboard from './Keyboard.js';
import Mouse from './Mouse.js';

class InputHandler {
    constructor() {
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        
        // Event subscriptions (for decoupled architecture)
        this.listeners = [];
        
        // Bind methods
        this.emit = this.emit.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
    }

    /**
     * Emit an input event to all subscribers
     */
    emit(event, data) {
        const listeners = this.listeners.filter(l => l.event === event);
        
        for (const listener of listeners) {
            try {
                listener.handler(data);
            } catch (error) {
                console.error('[InputHandler] Error in event handler:', error);
            }
        }
    },

    /**
     * Subscribe to an input event
     */
    on(event, handler) {
        if (!this.listeners.find(l => l.event === event)) {
            this.listeners.push({ event, handler });
            
            // Check for default handlers
            switch (event) {
                case 'keyDown':
                    // Could set up keyboard shortcuts here
                    break;
                case 'mouseDown':
                    // Could handle mouse clicks here
                    break;
            }
        }
        
        return true;
    },

    /**
     * Unsubscribe from an event
     */
    off(event, handler) {
        const index = this.listeners.findIndex(
            l => l.event === event && l.handler === handler
        );
        
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
        
        return true;
    },

    /**
     * Handle keyboard input for game movement
     */
    handleKeyboardInput() {
        const input = this.keyboard.processInput();
        
        if (input) {
            this.emit('movement', {
                dx: input.dx,
                dy: input.dy,
                timestamp: Date.now()
            });
        }
        
        return input;
    },

    /**
     * Process all current input and return combined state
     */
    processInput() {
        // Get keyboard movement intention
        const keyInput = this.handleKeyboardInput();
        
        // Check for mouse interactions
        if (Game?.player && Game.canvas) {
            const rect = Game.canvas.getBoundingClientRect();
            
            // Track hover position over game elements if needed
            const mouseX = keyInput ? null : (event?.clientX || 0);
            
            return {
                dx: keyInput?.dx,
                dy: keyInput?.dy,
                mouseButton: this.mouse.getPressedButtons(),
                timestamp: Date.now()
            };
        }
        
        return keyInput;
    },

    /**
     * Cleanup all input listeners and state
     */
    cleanup() {
        this.keyboard.cleanup();
        this.mouse.cleanup();
        this.listeners = [];
        
        console.log('[InputHandler] Cleanup complete');
    }
}

export default new InputHandler();
