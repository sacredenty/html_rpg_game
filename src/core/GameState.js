/**
 * GameState - Manages global game state
 */

const GameState = {
    // Game states
    START: 'start',
    PLAYING: 'playing',
    GAMEOVER: 'gameover',
    
    // Save slot modes
    NEW_GAME: 'new',
    LOAD_GAME: 'load',
    
    /**
     * Get current game state
     * @returns {string} Current game state
     */
    getState() {
        return this._state;
    },
    
    /**
     * Set game state
     * @param {string} newState - The new state to set
     */
    setState(newState) {
        if (GameState.isValidState(newState)) {
            this._state = newState;
            console.log(`[GameState] Changed to: ${newState}`);
        }
    },
    
    /**
     * Check if a state is valid
     * @param {string} state - State to validate
     * @returns {boolean} True if valid state
     */
    isValidState(state) {
        return Object.values(GameState).includes(state);
    },
    
    // Getters/setters with validation
    get state() { return this.getState(); },
    set state(val) { this.setState(val); }
};

export default GameState;
