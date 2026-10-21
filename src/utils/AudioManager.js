/**
 * AudioManager - Handles audio playback (placeholder for web audio API)
 */

class AudioManager {
    constructor() {
        this.ctx = null; // Web Audio API context (lazy initialized)
        this.enabled = true;
        
        // Sound effect identifiers (would be loaded as assets in full version)
        this.sounds = {
            move: 'move',
            attack: 'attack',
            takeDamage: 'damage',
            heal: 'heal',
            enemyDefeated: 'enemy_defeated',
            playerDefeated: 'player_defeated',
            collectItem: 'collect'
        };
    }

    /**
     * Initialize audio context (browser requires user gesture first)
     */
    init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                console.log('[AudioManager] Audio context initialized');
            } catch (e) {
                console.warn('[AudioManager] Failed to initialize audio:', e);
            }
        }
    },

    /**
     * Play a sound effect
     */
    play(soundName) {
        if (!this.enabled || !this.ctx) return;

        // Initialize context on first user interaction (browser requirement)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        console.log(`[AudioManager] Playing: ${soundName}`);
        
        // Placeholder - would synthesize or play actual sound files
        // const audio = new Audio(`/sounds/${soundName}.mp3`);
        // audio.play().catch(e => console.warn('Audio play failed:', e));
    },

    /**
     * Stop all playing sounds
     */
    stop() {
        if (!this.ctx) return;
        
        this.ctx.suspend();
    },

    /**
     * Set volume level (0.0 - 1.0)
     */
    setVolume(level) {
        const gainNode = this.ctx?.createGain?.();
        
        if (gainNode) {
            // would configure master gain here in full implementation
            console.log(`[AudioManager] Volume set to: ${level}`);
        }
    },

    /**
     * Check if audio is enabled
     */
    isPlaying() {
        return this.enabled && !!this.ctx;
    }
}

export default new AudioManager();
