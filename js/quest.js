// Quest System for RPG Adventure

const QuestSystem = {
    quests: [],

    questTemplates: [
        {
            id: 'find_herbs',
            name: 'Collect Healing Herbs',
            description: 'Gather 5 healing herbs from the forest.',
            type: 'collect',
            target: 'healingHerb',
            quantity: 5,
            reward: { xp: 30, gold: 20 }
        },
        {
            id: 'kill_slimes',
            name: 'Slime Hunter',
            description: 'Defeat 10 slimes to practice combat.',
            type: 'kill',
            target: 'slime',
            quantity: 10,
            reward: { xp: 50, gold: 30 }
        },
        {
            id: 'save_village',
            name: 'Save the Village',
            description: 'Defeat 5 goblins threatening the village.',
            type: 'kill',
            target: 'goblin',
            quantity: 5,
            reward: { xp: 100, gold: 100 }
        },
        {
            id: 'find_legendary_sword',
            name: 'Legendary Sword Quest',
            description: 'Find the legendary sword in the dungeon.',
            type: 'collect',
            target: 'legendarySword',
            quantity: 1,
            reward: { xp: 200, gold: 300 }
        },
        {
            id: 'defeat_dragon',
            name: 'Dragon Slayer',
            description: 'Defeat the mighty dragon protecting the treasure.',
            type: 'kill',
            target: 'dragon',
            quantity: 1,
            reward: { xp: 500, gold: 1000 }
        }
    ],

    init(player) {
        const savedQuests = player.quests || {};
        player.quests = {};
        player.killCounts = player.killCounts || {};
        this.quests = this.questTemplates.map(template => {
            const saved = savedQuests[template.id];
            const quest = {
                ...template,
                reward: { ...template.reward },
                accepted: saved ? (saved.accepted ?? true) : false,
                completed: saved?.completed || false,
                progress: saved?.progress || 0
            };
            player.quests[quest.id] = {
                accepted: quest.accepted,
                completed: quest.completed,
                progress: quest.progress
            };
            return quest;
        });
        this.renderQuests();
    },

    syncQuest(player, quest) {
        player.quests[quest.id] = {
            accepted: quest.accepted,
            completed: quest.completed,
            progress: quest.progress
        };
    },

    renderQuests() {
        const container = document.getElementById('quests-container');
        const active = this.quests.filter(quest => quest.accepted && !quest.completed);
        const completed = this.quests.filter(quest => quest.completed);
        let html = '';

        if (active.length) {
            html += '<h4>Active Quests</h4>';
            active.forEach(quest => {
                html += `
                    <div class="quest-item" id="quest-${quest.id}">
                        <strong>${quest.name}</strong><br>
                        ${quest.description}<br>
                        <small>Progress: ${Math.min(quest.progress, quest.quantity)}/${quest.quantity} · Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold</small>
                    </div>
                `;
            });
        }

        if (completed.length) {
            html += '<h4 style="margin-top:15px;">Completed Quests</h4>';
            completed.forEach(quest => {
                html += `
                    <div class="quest-item quest-completed" id="quest-${quest.id}">
                        <strong>${quest.name}</strong><br>
                        <small style="color:#6ee7b7;">✓ Completed · Reward claimed</small>
                    </div>
                `;
            });
        }

        container.innerHTML = html || '<p style="text-align:center;color:#9ca3af;">Talk to King Alaric to get a quest.</p>';
    },

    renderQuestBoard(player) {
        const container = document.getElementById('interaction-content');
        const available = this.quests.filter(quest => !quest.accepted && !quest.completed);
        const active = this.quests.filter(quest => quest.accepted && !quest.completed);
        const availableHtml = available.length
            ? available.map(quest => `
                <div class="shop-item">
                    <span><strong>${quest.name}</strong><small>${quest.description} Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold.</small></span>
                    <button type="button" data-accept-quest="${quest.id}">Accept</button>
                </div>
            `).join('')
            : '<p>There are no new quests available.</p>';
        const activeHtml = active.length
            ? `<h4>In progress</h4>${active.map(quest =>
                `<p>${quest.name}: ${Math.min(quest.progress, quest.quantity)}/${quest.quantity}</p>`
            ).join('')}`
            : '';

        container.innerHTML = `<p>Help the people of the realm and earn rewards.</p>${activeHtml}<h4>Available quests</h4>${availableHtml}`;
        container.querySelectorAll('[data-accept-quest]').forEach(button => {
            button.addEventListener('click', () => this.acceptQuest(player, button.dataset.acceptQuest));
        });
    },

    acceptQuest(player, questId) {
        const quest = this.quests.find(entry => entry.id === questId);
        if (!quest || quest.accepted || quest.completed) return;
        quest.accepted = true;
        this.syncQuest(player, quest);
        this.renderQuests();
        this.renderQuestBoard(player);
        Utils.showMessage(`Quest accepted: ${quest.name}.`, 'success');
    },

    checkQuestCompletion(player, monsterType) {
        player.killCounts[monsterType] = (player.killCounts[monsterType] || 0) + 1;
        this.quests
            .filter(quest => quest.accepted && !quest.completed && quest.type === 'kill' && quest.target === monsterType)
            .forEach(quest => this.addProgress(player, quest));
    },

    recordCollection(player, itemType) {
        this.quests
            .filter(quest => quest.accepted && !quest.completed && quest.type === 'collect' && quest.target === itemType)
            .forEach(quest => this.addProgress(player, quest));
    },

    addProgress(player, quest) {
        quest.progress = Math.min(quest.quantity, quest.progress + 1);
        this.syncQuest(player, quest);
        if (quest.progress >= quest.quantity) {
            this.completeQuest(player, quest);
        } else {
            this.renderQuests();
        }
    },

    completeQuest(player, quest) {
        quest.completed = true;
        this.syncQuest(player, quest);
        const levelsGained = player.gainXp(quest.reward.xp);
        Game.addGold(quest.reward.gold);
        this.renderQuests();
        if (document.getElementById('interaction-panel').dataset.type === 'quests') {
            this.renderQuestBoard(player);
        }
        const levelMessage = levelsGained > 0 ? ` Level up! You reached level ${player.level}.` : '';
        Utils.showMessage(`Quest complete: ${quest.name}! Earned ${quest.reward.xp} XP and ${quest.reward.gold} gold.${levelMessage}`, 'success');
    }
};
