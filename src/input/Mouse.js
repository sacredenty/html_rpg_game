/**
 * Mouse - Mouse input handling
 */

class Mouse {
    constructor() {
        this.pressed = new Set();
        
        // Bind event handlers
        this.onMouseDown = this.handleMouseDown.bind(this);
        this.onMouseUp = this.handleMouseUp.bind(this);
        
        // Button mappings
        this.buttonMappings = {
            0: 'left',
            2: 'middle',
            3: 'right'
        };
    }

    /**
     * Handle mouse button press
     */
    handleMouseDown(event) {
        const button = this.buttonMappings[event.button] || event.button;
        const rect = event.target.getBoundingClientRect();
        
        // Track button state (prevent same button from triggering multiple times)
        if (!this.pressed.has(button)) {
            this.pressed.add(button);
            
            InputHandler?.emit('mouseDown', {
                button,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                timestamp: Date.now()
            });
        }
        
        return true;
    }

    /**
     * Handle mouse button release
     */
    handleMouseUp(event) {
        const button = this.buttonMappings[event.button] || event.button;
        
        if (this.pressed.has(button)) {
            this.pressed.delete(button);
            
            InputHandler?.emit('mouseUp', {
                button,
                x: event.clientX - event.target.getBoundingClientRect().left,
                y: event.clientY - event.target.getBoundingClientRect().top,
                timestamp: Date.now()
            });
        }
        
        return true;
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(event) {
        const rect = event.target.getBoundingClientRect();
        
        InputHandler?.emit('mouseMove', {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            timestamp: Date.now()
        });
    }

    /**
     * Get currently pressed buttons as an array
     */
    getPressedButtons() {
        return Array.from(this.pressed);
    }

    /**
     * Attach mouse listeners to canvas or document
     */
    attachToElement(element) {
        const handleClick = (e) => e.type === 'mousedown' ? this.onMouseDown(e) : 
                                  e.type === 'mouseup' ? this.onMouseUp(e) : null;
        
        element.addEventListener('click', handleClick);
        
        // Track mouse movement if element supports it
        if (element.tagName === 'CANVAS') {
            element.addEventListener('mousemove', this.handleMouseMove);
        }
        
        console.log('[Mouse] Attached to', element);
        return true;
    }

    /**
     * Attach listeners to canvas or document body
     */
    attachToListeners() {
        // Try to attach to game canvas if available, otherwise use document
        const target = Game?.canvas || window.document.body;
        this.attachToElement(target);
        
        return true;
    }

    /**
     * Cleanup listeners
     */
    cleanup() {
        this.pressed.clear();
        InputHandler?.emit('mouse', null); // Emit mouse release event
        
        console.log('[Mouse] Cleanup complete');
    }
}

export default Mouse;
