/**
 * EventBus - Simple event system for decoupled architecture
 */

class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     */
    on(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(handler);
        
        return () => this.off(event, handler); // Return unsubscribe function
    },

    /**
     * Emit an event to all subscribers
     */
    emit(event, data) {
        const handlers = this.listeners.get(event) || [];
        
        for (const handler of handlers) {
            try {
                handler(data);
            } catch (error) {
                console.error('[EventBus] Error in event handler:', error);
            }
        }
    },

    /**
     * Unsubscribe from an event
     */
    off(event, handler) {
        const handlers = this.listeners.get(event);
        
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    },

    /**
     * Clear all event listeners
     */
    clear() {
        this.listeners.clear();
    }
}

export default new EventBus();
