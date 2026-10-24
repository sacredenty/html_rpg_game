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
        darkLordsSword: {
            name: "Dark Lord's Sword",
            description: '+12 Strength, legendary weapon of darkness',
            effect: () => ({ strength: 12 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 12, legendary: true },
            symbol: '🗡️⚫',
            color: '#7f1d1d'
        },
        shield: {
            name: 'Wooden Shield',
            description: '+2 Defense',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'shield',
            bonuses: { defense: 2 },
            symbol: '🛡️',
            color: '#9ca3af'
        },
        steelShield: {
            name: 'Steel Shield',
            description: '+5 Defense',
            effect: () => ({ defense: 5 }),
            equipmentSlot: 'shield',
            bonuses: { defense: 5 },
            symbol: '🛡️',
            color: '#cbd5e1'
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
        
        // NEW EQUIPMENT CATEGORIES
        
        helmet: {
            name: 'Iron Helmet',
            description: '+3 Defense, protects head',
            effect: () => ({ defense: 3 }),
            equipmentSlot: 'helmet',
            bonuses: { defense: 3 },
            symbol: '⛑️',
            color: '#6b7280'
        },

        steelHelmet: {
            name: 'Steel Helmet',
            description: '+5 Defense, reinforced protection',
            effect: () => ({ defense: 5 }),
            equipmentSlot: 'helmet',
            bonuses: { defense: 5 },
            symbol: '⛑️',
            color: '#9ca3af'
        },

        boots: {
            name: 'Leather Boots',
            description: '+2 Defense, improves movement speed slightly',
            effect: () => ({ defense: 2 }),
            equipmentSlot: 'boots',
            bonuses: { defense: 2 },
            symbol: '👢',
            color: '#d97706'
        },

        steelBoots: {
            name: 'Steel Boots',
            description: '+4 Defense, armored footwear',
            effect: () => ({ defense: 4 }),
            equipmentSlot: 'boots',
            bonuses: { defense: 4 },
            symbol: '👢',
            color: '#6b7280'
        },

        amulet: {
            name: 'Iron Amulet',
            description: '+3 Strength or Magic (choose one)',
            effect: () => ({ strength: 3 }),
            equipmentSlot: 'amulet',
            bonuses: { strength: 3, magic: 0 }, // Can be changed to magic
            symbol: '📿',
            color: '#fbbf24'
        },

        rubyAmulet: {
            name: 'Ruby Amulet',
            description: '+5 Strength or Magic (choose one)',
            effect: () => ({ strength: 5 }),
            equipmentSlot: 'amulet',
            bonuses: { strength: 5, magic: 0 },
            symbol: '📿',
            color: '#ef4444'
        },

        staff: {
            name: 'Oak Staff',
            description: '+3 Magic for spellcasters',
            effect: () => ({ magic: 3 }),
            equipmentSlot: 'staff',
            bonuses: { magic: 3 },
            symbol: '🪄',
            color: '#a855f7'
        },

        crystalStaff: {
            name: 'Crystal Staff',
            description: '+6 Magic, crackles with arcane energy',
            effect: () => ({ magic: 6 }),
            equipmentSlot: 'staff',
            bonuses: { magic: 6 },
            symbol: '🪄✨',
            color: '#8b5cf6'
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
        },

        // NEW BOSS DROP ITEMS
        fireCrystal: {
            name: 'Fire Crystal',
            description: '+5 Magic, burns on contact (+3 damage vs fire enemies)',
            effect: () => ({ magic: 5 }),
            equipmentSlot: 'accessory',
            bonuses: { magic: 5, elementDamage: 'fire' },
            symbol: '🔥',
            color: '#f97316'
        },
        iceShard: {
            name: 'Ice Shard',
            description: '+5 Magic, slows enemies on hit (+3 damage vs ice enemies)',
            effect: () => ({ magic: 5 }),
            equipmentSlot: 'accessory',
            bonuses: { magic: 5, elementDamage: 'ice' },
            symbol: '❄️',
            color: '#06b6d4'
        },
        shadowShard: {
            name: 'Shadow Shard',
            description: '+3 Strength, drains health on critical hits',
            effect: () => ({ strength: 3 }),
            equipmentSlot: 'accessory',
            bonuses: { strength: 3, lifeDrain: true },
            symbol: '🌑',
            color: '#6b7280'
        },
        darkLordsHeart: {
            name: "Dark Lord's Heart",
            description: '+15 Strength, legendary artifact of immense power',
            effect: () => ({ strength: 15 }),
            equipmentSlot: 'weapon',
            bonuses: { strength: 15, legendary: true },
            symbol: '👑',
            color: '#f43f5e'
        },
        fireElixir: {
            name: 'Fire Elixir',
            description: 'Restores 50 HP over 10 seconds (long duration)',
            effect: () => ({ hp: 50, duration: 10 }),
            symbol: '🔥✨',
            color: '#fb923c'
        },
        frostBrew: {
            name: 'Frost Brew',
            description: 'Restores 40 HP and reduces incoming damage by 5 for 15 seconds',
            effect: () => ({ hp: 40, damageReduction: 5 }),
            symbol: '❄️💙',
            color: '#67e8f9'
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
