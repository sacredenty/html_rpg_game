/**
 * HUD - Heads-Up Display component
 */

class HUD {
    constructor(game, containerId = 'hud-container') {
        this.game = game;
        this.container = document.getElementById(containerId);
        this.player = null;
        
        // Element references (lazy-bound after DOM is ready)
        this.hpDisplay = null;
        this.mpDisplay = null;
        this.levelDisplay = null;
        this.xpDisplay = null;
        
        // Bind update method
        this.updateHUD = this.updateHUD.bind(this);
    }

    /**
     * Attach player to HUD
     */
    attachPlayer(player) {
        this.player = player;
        
        if (this.container) {
            this.container.innerHTML = this.generateHTML();
            
            // Cache DOM elements for performance
            const dom = {
                hpDisplay: this.container.querySelector('#hp-display'),
                mpDisplay: this.container.querySelector('#mp-display'),
                levelDisplay: this.container.querySelector('#level-display'),
                xpDisplay: this.container.querySelector('#xp-display')
            };
            
            if (dom.hpDisplay) this.hpDisplay = dom.hpDisplay;
            if (dom.mpDisplay) this.mpDisplay = dom.mpDisplay;
            if (dom.levelDisplay) this.levelDisplay = dom.levelDisplay;
            if (dom.xpDisplay) this.xpDisplay = dom.xpDisplay;
        }
    }

    /**
     * Generate HUD HTML structure
     */
    generateHTML() {
        const styles = `
            <style>
                #hud-container {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    z-index: 1000;
                }
                #hp-display, #mp-display, #level-display, #xp-display {
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-family: monospace;
                    margin-right: 10px;
                }
                #hp-display { color: #ff6b6b; }
                #mp-display { color: #4ecdc4; }
            </style>
        `;
        
        return styles + `
            <div id="hp-display">??/??</div>
            <div id="mp-display">??/??</div>
            <div id="level-display">Lvl 1</div>
            <div id="xp-display">0/0 XP</div>
        `;
    }

    /**
     * Update all HUD elements
     */
    updateHUD() {
        if (!this.player) return;
        
        // Update health display with color coding
        const hpRatio = this.player.hp / this.player.maxHp;
        let hpColor = '#ff6b6b';
        
        if (hpRatio > 0.5) {
            hpColor = '#66cc66'; // Green for good health
        } else if (hpRatio < 0.25) {
            hpColor = '#cc4444'; // Dark red for critical health
        }
        
        const hpEl = this.hpDisplay;
        if (hpEl) {
            hpEl.textContent = `${this.player.hp}/${this.player.maxHp}`;
            hpEl.style.color = hpColor;
        }

        // Update mana display
        const mpEl = this.mpDisplay;
        if (mpEl) {
            mpEl.textContent = `${this.player.mp}/${this.player.maxMp || '0'}`;
        }

        // Update level display
        const lvlEl = this.levelDisplay;
        if (lvlEl) {
            lvlEl.textContent = `Lvl ${this.player.level} ${this.player.className}`;
        }

        // Update XP display
        const xpEl = this.xpDisplay;
        if (xpEl) {
            xpEl.textContent = `${this.player.xp}/${this.player.xpToNextLevel} XP`;
        }
    }

    /**
     * Cleanup when game ends
     */
    cleanup() {
        this.game = null;
        this.player = null;
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default HUD;
