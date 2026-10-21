/**
 * DialogueBox - Handles combat dialogue and messages
 */

class DialogueBox {
    constructor(containerId = 'dialogue-container') {
        this.container = document.getElementById(containerId);
        
        // Create HTML structure if container doesn't exist
        if (!this.container) {
            const styles = `
                <style>
                    #dialogue-container {
                        position: absolute;
                        bottom: 10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        max-width: 600px;
                        background: rgba(26, 32, 44, 0.95);
                        border: 2px solid #1e293b;
                        border-radius: 8px;
                        padding: 15px;
                        color: white;
                        font-family: monospace;
                        min-height: 60px;
                        z-index: 1000;
                    }
                    #dialogue-container::before {
                        content: "⚔️";
                        position: absolute;
                        top: -25px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 32px;
                    }
                </style>
            `;
            
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.innerHTML = styles + '<div id="dialogue-text">Welcome to the game! Fight monsters, explore the world, and complete quests!</div>';
            
            // Append to body if not already attached
            if (!document.body.contains(this.container)) {
                document.body.appendChild(this.container);
            }
        }
        
        this.textElement = this.container.querySelector('#dialogue-text');
        
        // Bind methods
        this.showDialogue = this.showDialogue.bind(this);
    }

    /**
     * Show a dialogue message
     */
    showDialogue(text, type = 'normal', delay = 0) {
        if (delay > 0) {
            setTimeout(() => this.showDialogue(text, type), delay);
            return;
        }
        
        // Clear previous text with fade effect
        if (this.textElement) {
            const oldText = this.textElement.textContent;
            
            // Add animation class
            this.container.classList.add('fade-in');
            
            setTimeout(() => {
                this.textElement.textContent = text;
                
                // Remove fade-in after display
                setTimeout(() => {
                    this.container.classList.remove('fade-in');
                }, 2000);
            }, 300);
        }
        
        return true;
    }

    /**
     * Show system/debug message
     */
    showSystemMessage(message) {
        if (!this.textElement) return false;
        
        this.textElement.textContent = `[SYSTEM] ${message}`;
        return true;
    }

    /**
     * Clear the dialogue box
     */
    clear() {
        if (this.textElement) {
            this.textElement.textContent = '';
        }
        return true;
    }

    /**
     * Show quest update message
     */
    showQuestUpdate(questId, title, progress) {
        if (!this.textElement) return false;
        
        const messages = {
            'meetKing': `👑 Quest: Meet the King - ${progress}/${questData.targetObjectives[0]?.required} objectives`,
            'collectHealingHerbs': `🌿 Quest: Gather Healing Herbs - ${progress}/${questData.targetObjectives[0]?.required}`,
            'defeatSlimes': `💚 Quest: Defeat Slimes - ${progress}/${questData.targetObjectives[0]?.required}`,
            // ... add other quest types
        };
        
        const msg = messages[questId] || null;
        if (msg) {
            this.showDialogue(msg);
        }
        
        return true;
    }

    /**
     * Show combat feedback message
     */
    showCombatFeedback(damage, targetName, isPlayerHit = false) {
        const color = isPlayerHit ? 'red' : '#4ade80'; // Red for damage taken, green for dealing damage
        
        if (!this.textElement) return false;
        
        this.textElement.textContent = `${isPlayerHit ? `❌ ` : '✅ '}${targetName} takes ${damage} damage!`;
        this.textElement.style.color = color;
        
        setTimeout(() => {
            this.textElement.style.color = ''; // Reset to default
        }, 2000);
        
        return true;
    }
}

export default DialogueBox;
