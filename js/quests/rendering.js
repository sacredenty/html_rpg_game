// Rendering
Object.assign(QuestSystem, {
    renderQuestBoard(player = Game.player, showAvailable = false) {
        const container = document.getElementById('accepted-quests-container');

        const active = this.activeQuests.filter(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );
        const completed = this.completedQuests;

        let activeHtml = '';
        if (active.length) {
            activeHtml = '<h4 style="margin: 10px 0;">In Progress</h4>' + 
                active.map(quest => {
                    const objective = quest.objectives?.find(item =>
                        item.type === 'kill' || item.type === 'collect'
                    );
                    const progress = objective
                        ? (objective.type === 'kill'
                            ? this.playerKillCounts[objective.target]
                            : this.playerCollections[objective.target]) || 0
                        : quest.state.progress;
                    const total = objective?.quantity || '?';
                    return `
                    <div style="background: #f3f4f6; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <strong style="color: #1f2937;">${quest.name}</strong><br>
                        <small style="color: #374151;">${quest.description}</small><br>
                        <span style="font-size: 12px; color: #6b7280;">
                            Progress: ${progress}/${total}
                        </span><br>
                        <button 
                            type="button" 
                            class="quest-drop-btn"
                            data-quest-id="${quest.id}" 
                            style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 5px;">
                            Drop Quest
                        </button>
                    </div>
                `;
                }).join('');
        } else {
            activeHtml = '<p style="color: #6b7280;">No active quests.</p>';
        }

        let completedHtml = '';
        if (completed.length) {
            completedHtml = '<h4 style="margin: 10px 0; color: #059669;">Completed</h4>' +
                completed.map(quest => `
                    <div style="background: #d1fae5; padding: 8px; margin: 5px 0; border-radius: 4px;">
                        <strong style="color: #065f46;">${quest.name} ✓</strong><br>
                        <small style="color: #047857;">Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold</small>
                    </div>
                `).join('')
            ;
        } else {
            completedHtml = '<p style="color: #6b7280;">No completed quests.</p>';
        }

        if (container) {
            container.innerHTML = `
                <div style="padding: 15px;">
                    ${activeHtml}
                    ${completedHtml}
                </div>
            `;
            container.querySelectorAll('.quest-drop-btn').forEach(button => {
                button.addEventListener('click', () => this.dropQuest(button.dataset.questId));
            });
        }

        if (showAvailable) {
            const interaction = document.getElementById('interaction-content');
            if (!interaction) return;
            const available = this.getAvailableQuests();
            const availableHtml = available.length
                ? '<h4 style="margin: 10px 0; color: #059669;">Available Quests</h4>' +
                    available.map(quest => `
                    <div class="shop-item" style="background: #f9fafb; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 4px solid ${this.getQuestColor(quest.category)};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <strong style="font-size: 15px; color: #1f2937;">${quest.name}</strong>
                                <small style="color: #4b5563;">${quest.description}</small><br>
                                <span style="font-size: 12px; color: #6b7280;">
                                    Reward: +${quest.reward.xp} XP, ${quest.reward.gold} gold
                                </span>
                            </div>
                            <button 
                                type="button" 
                                class="quest-accept-btn"
                                data-quest-id="${quest.id}" 
                                style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                Accept
                            </button>
                        </div>
                    </div>
                `).join('')
                : '<p style="color: #4b5563;">No new quests available.</p>';
            interaction.innerHTML = `<div class="available-quests-widget">${availableHtml}</div>`;
            interaction.querySelectorAll('.quest-accept-btn').forEach(button => {
                button.addEventListener('click', () => this.acceptQuest(button.dataset.questId));
            });
        }
    },

    // Render active quests panel

    renderActiveQuests() {
        const container = document.getElementById('interaction-content');
        if (!container) return;

        const active = this.activeQuests.filter(quest => 
            quest.state && quest.state.accepted && !quest.state.completed
        );

        let html = '';
        if (active.length) {
            html += '<h4 style="margin: 0 0 10px;">Active Quests</h4>';
            
            active.forEach(quest => {
                const objective = quest.objectives?.find(o => 
                    o.type === 'kill' || o.type === 'collect'
                );
                if (!objective) return;

                const progress = this.playerKillCounts[objective.target] || 
                               this.playerCollections[objective.target] || 0;
                const total = objective.quantity;
                
                html += `
                    <div style="background: #1e293b; padding: 12px; margin: 8px 0; border-radius: 6px;">
                        <strong style="color: #fbbf24;">${quest.name}</strong><br>
                        <small style="color: #94a3b8;">${quest.description}</small><br>
                        <span style="color: #60a5fa; font-size: 14px;">
                            Progress: ${progress}/${total}
                        </span><br>
                        <button 
                            type="button" 
                            class="quest-drop-btn active-quest-drop"
                            data-quest-id="${quest.id}" 
                            style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 5px;">
                            Drop Quest
                        </button>
                    </div>
                `;
            });

            html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #374151;">';
        }

        container.innerHTML = html || '<p style="color: #9ca3af;">No active quests.</p>';
    },

});
