// Inventory game behavior
Object.assign(Game, {
    rest() {
        if (this.player.hp <= 0) return;
        
        const healAmount = Utils.random(15, 25);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        GameAudio.heal();
        const goldBonus = this.player.getEquipmentBonus('goldPerRest');
        if (goldBonus > 0) {
            this.addGold(goldBonus);
        }

        Utils.showMessage(
            goldBonus > 0
                ? `Restored ${healAmount} HP and earned ${goldBonus} gold!`
                : `Restored ${healAmount} HP!`,
            'success'
        );
        this.render();
    },

    // Use an item from inventory

    useItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;
        
        const item = this.player.inventory[itemIndex];
        const itemTemplate = Entities.Items[item.type];
        if (itemTemplate?.equipmentSlot) {
            Utils.showMessage(`${item.name} must be equipped from the inventory.`, 'warning');
            return;
        }
        if (!itemTemplate) {
            Utils.showMessage(`Cannot use ${item.name}: item data is missing.`, 'error');
            return;
        }
        const effect = itemTemplate.effect();
        if (effect.mp && this.player.maxMp === 0) {
            Utils.showMessage(`${this.player.className} cannot use mana potions.`, 'warning');
            return;
        }
        
        // Apply effects
        if (effect.hp) this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.hp);
        if (effect.mp) this.player.mp = Math.min(this.player.maxMp, this.player.mp + effect.mp);
        if (effect.strength) this.player.stats.strength += effect.strength;
        if (effect.hp || effect.mp) GameAudio.heal();
        
        // Remove item
        this.player.removeInventoryItem(itemId);
        
        Utils.showMessage(`Used ${item.name}!`, 'success');
        this.updateInventoryDisplay();
        this.render();
    },

    equipItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.player.inventory[itemIndex];
        const itemTemplate = Entities.Items[item.type];
        const slot = itemTemplate?.equipmentSlot;
        if (!slot) return;

        const previousItem = this.player.equipment[slot];
        if (previousItem) {
            this.player.inventory.push(previousItem);
        }

        this.player.inventory.splice(itemIndex, 1);
        this.player.equipment[slot] = {
            ...item,
            equipmentSlot: slot,
            bonuses: itemTemplate.bonuses
        };

        this.player.updateStatsDisplay();
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.render();
        Utils.showMessage(`Equipped ${item.name}.`, 'success');
    },

    unequipItem(slot) {
        const item = this.player.equipment[slot];
        if (!item) return;

        this.player.inventory.push(item);
        this.player.equipment[slot] = null;
        this.player.updateStatsDisplay();
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.render();
        Utils.showMessage(`Unequipped ${item.name}.`, 'info');
    },

    // Add gold

    addGold(amount) {
        const currentGold = this.getGold();
        localStorage.setItem('rpg_gold', currentGold + amount);
        this.updateGoldDisplay();
        Utils.showMessage(`+${amount} gold!`, 'success');
    },

    updateGoldDisplay() {
        document.getElementById('gold-display').textContent = this.getGold().toLocaleString();
    },

    getGold() {
        const gold = Number.parseInt(localStorage.getItem('rpg_gold') || '0', 10);
        return Number.isFinite(gold) ? Math.max(0, gold) : 0;
    },

    spendGold(amount) {
        if (!Number.isInteger(amount) || amount < 0 || this.getGold() < amount) return false;
        localStorage.setItem('rpg_gold', this.getGold() - amount);
        this.updateGoldDisplay();
        return true;
    },

    buyItem(type) {
        const price = this.shopStock[type];
        const template = Entities.Items[type];
        if (!template || !price) {
            Utils.showMessage('That item is not available in the shop.', 'error');
            return;
        }
        if (!this.spendGold(price)) {
            Utils.showMessage(`You need ${price} gold to buy ${template.name}.`, 'warning');
            return;
        }
        this.player.addInventoryItem(Entities.createItem(type, this.player.x, this.player.y));
        this.updateTradeDisplay();
        Utils.showMessage(`Bought ${template.name} for ${price} gold.`, 'success');
    },

    sellItem(itemId) {
        const itemIndex = this.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        const item = this.player.inventory[itemIndex];
        const basePrice = this.shopStock[item.type];
        if (!basePrice) {
            Utils.showMessage(`${item.name} cannot be sold here.`, 'warning');
            return;
        }
        const sellPrice = Math.max(1, Math.floor(basePrice / 2));
        this.player.inventory.splice(itemIndex, 1);
        this.addGold(sellPrice);
        window.updateInventoryDisplay();
        this.updateTradeDisplay();
        Utils.showMessage(`Sold ${item.name} for ${sellPrice} gold.`, 'success');
    },

    updateTradeDisplay() {
        const container = document.getElementById('interaction-content');
        container.innerHTML = `
            <p>Your gold: <strong>${this.getGold().toLocaleString()}</strong></p>
            <h4>Buy</h4>
            <div class="shop-list">
                ${Object.entries(this.shopStock).map(([type, price]) => {
                    const item = Entities.Items[type];
                    return `<div class="shop-item">
                        <span>${item.symbol} <strong>${item.name}</strong><small>${item.description}</small></span>
                        <button type="button" data-buy-item="${type}">Buy · ${price}g</button>
                    </div>`;
                }).join('')}
            </div>
            <h4>Sell</h4>
            ${this.player.inventory.length
                ? `<div class="shop-list">${this.player.inventory.map(item => {
                    const price = this.shopStock[item.type];
                    const value = price ? Math.max(1, Math.floor(price / 2)) : 0;
                    return `<div class="shop-item">
                        <span>${item.symbol} <strong>${item.name}</strong><small>${value ? `Sell value: ${value}g` : 'Not accepted'}</small></span>
                        ${value ? `<button type="button" data-sell-item="${item.id}">Sell · ${value}g</button>` : ''}
                    </div>`;
                }).join('')}</div>`
                : '<p>Your inventory is empty.</p>'}
            <p class="shop-note">Equipped gear must be unequipped before it can be sold. Sell prices are half the shop price.</p>
        `;
        container.querySelectorAll('[data-buy-item]').forEach(button => {
            button.addEventListener('click', () => this.buyItem(button.dataset.buyItem));
        });
        container.querySelectorAll('[data-sell-item]').forEach(button => {
            button.addEventListener('click', () => this.sellItem(button.dataset.sellItem));
        });
    },
});
