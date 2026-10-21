// Interaction game behavior
Object.assign(Game, {
    interact() {
        const npc = this.npcs
            .filter(candidate => candidate.alive)
            .sort((a, b) => Utils.distance(this.player, a) - Utils.distance(this.player, b))[0];
        if (!npc || Utils.distance(this.player, npc) > 2) {
            Utils.showMessage('Move next to a character to talk to them.', 'warning');
            return;
        }
        this.openNPCInteraction(npc);
    },

    openNPCInteraction(npc) {
        const panel = document.getElementById('interaction-panel');
        const title = document.getElementById('interaction-title');
        const content = document.getElementById('interaction-content');
        panel.hidden = false;
        title.textContent = npc.name;

        if (npc.type === 'merchant') {
            panel.dataset.type = 'merchant';
            this.updateTradeDisplay();
        } else if (npc.type === 'king') {
            panel.dataset.type = 'quests';
            QuestSystem.renderQuestBoard(this.player, true);
        } else {
            panel.dataset.type = 'villager';
            content.textContent = npc.dialogue;
        }
        panel.scrollIntoView({ block: 'nearest' });
    },

    // Render the game
});
