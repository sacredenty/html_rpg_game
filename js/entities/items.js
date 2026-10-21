// Items
Object.assign(Entities, {
    Items: {
        healthPotion: {
            name: 'Health Potion',
            description: 'Restores 30 HP',
            effect: () => ({ hp: 30 }),
            symbol: '🧪',
            color: '#ef4444'
        },
        healingHerb: {
            name: 'Healing Herb',
            description: 'Restores 10 HP',
            effect: () => ({ hp: 10 }),
            symbol: '🌿',
            color: '#22c55e'
        },
        manaPotion: {
            name: 'Mana Potion',
            description: 'Restores 25 MP',
            effect: () => ({ mp: 25 }),
            symbol: '💜',
            color: '#8b5cf6'
        },
        sword: {
            name: 'Iron Sword',
            description: '+3 Strength',
            effect: () => ({ strength: 3 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 3 },
            symbol: '⚔️',
            color: '#fbbf24'
        },
        legendarySword: {
            name: 'Legendary Sword',
            description: '+8 Strength',
            effect: () => ({ strength: 8 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 8 },
            symbol: '🗡️',
            color: '#fef08a'
        },
        shield: {
            name: 'Wooden Shield',
            description: '+2 Defense',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 2 },
            symbol: '🛡️',
            color: '#9ca3af'
        },
        leatherArmor: {
            name: 'Leather Armor',
            description: '+2 Defense',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 2 },
            symbol: '🥋',
            color: '#a16207'
        },
        chainmail: {
            name: 'Chainmail',
            description: '+4 Defense',
            effect: () => ({ defense: 4 }),
            equipmentSlot: 'armor',
            bonuses: { defense: 4 },
            symbol: '⛓️',
            color: '#94a3b8'
        },
        goldRing: {
            name: 'Gold Ring',
            description: '+5 Gold when resting',
            effect: () => ({ goldPerRest: 5 }),
            equipmentSlot: 'accessory',
            bonuses: { goldPerRest: 5 },
            symbol: '💍',
            color: '#fbbf24'
        },
        silverRing: {
            name: 'Silver Ring',
            description: '+10 Gold when resting',
            effect: () => ({ goldPerRest: 10 }),
            equipmentSlot: 'accessory',
            bonuses: { goldPerRest: 10 },
            symbol: '💍',
            color: '#cbd5e1'
        },
        luckyCharm: {
            name: 'Lucky Charm',
            description: '+2 Strength',
            effect: () => ({ strength: 2 }),
            equipmentSlot: 'accessory',
            bonuses: { strength: 2 },
            symbol: '🍀',
            color: '#4ade80'
        }
    },

    // Create item instance

    createItem: (type, x, y) => {
        const template = Entities.Items[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            description: template.description,
            effect: template.effect,
            equipmentSlot: template.equipmentSlot || null,
            bonuses: template.bonuses || {},
            symbol: template.symbol,
            color: template.color,
            x: x,
            y: y,
            alive: true
        };
    },

});
