// Monsters
Object.assign(Entities, {
    Monsters: {
        slime: {
            name: 'Slime',
            hp: 30,
            maxHp: 30,
            attack: 3,
            defense: 1,
            xp: 20,
            gold: 5,
            symbol: '🟢',
            color: '#4ade80',
            size: 0.6
        },
        goblin: {
            name: 'Goblin',
            hp: 50,
            maxHp: 50,
            attack: 6,
            defense: 2,
            xp: 35,
            gold: 10,
            symbol: '👺',
            color: '#fbbf24',
            size: 0.7
        },
        orc: {
            name: 'Orc Warrior',
            hp: 80,
            maxHp: 80,
            attack: 10,
            defense: 4,
            xp: 60,
            gold: 20,
            symbol: '👹',
            color: '#ef4444',
            size: 0.8
        },
        wolf: {
            name: 'Wolf',
            hp: 40,
            maxHp: 40,
            attack: 7,
            defense: 2,
            xp: 30,
            gold: 8,
            symbol: '🐺',
            color: '#e5e7eb',
            size: 0.6
        },
        skeleton: {
            name: 'Skeleton',
            hp: 45,
            maxHp: 45,
            attack: 8,
            defense: 3,
            xp: 40,
            gold: 12,
            symbol: '💀',
            color: '#9ca3af',
            size: 0.7
        },


        // ULTIMATE BOSS - Final challenge of the main questline
        darkLord: {
            name: 'Dark Lord',
            hp: 800,
            maxHp: 800,
            attack: 35,
            defense: 20,
            xp: 1200,
            gold: 600,
            symbol: '👿',
            color: '#7f1d1d',
            size: 1.5,
            special: 'Dark Presence'
        },

        // Elite Boss Monsters
        fireDrake: {
            name: 'Fire Drake',
            hp: 450,
            maxHp: 450,
            attack: 28,
            defense: 16,
            xp: 650,
            gold: 350,
            symbol: '🐲',
            color: '#f97316',
            size: 1.4,
            special: 'Fire Breath'
        },
        iceDragon: {
            name: 'Ice Dragon',
            hp: 420,
            maxHp: 420,
            attack: 26,
            defense: 18,
            xp: 680,
            gold: 380,
            symbol: '❄️',
            color: '#06b6d4',
            size: 1.4,
            special: 'Ice Nova'
        },
        shadowKnight: {
            name: 'Shadow Knight',
            hp: 350,
            maxHp: 350,
            attack: 24,
            defense: 14,
            xp: 550,
            gold: 300,
            symbol: '🗡️',
            color: '#6b7280',
            size: 1.3,
            special: 'Shadow Step'
        },

        dragon: {
            name: 'Dragon',
            hp: 300,
            maxHp: 300,
            attack: 25,
            defense: 15,
            xp: 500,
            gold: 500,
            symbol: '🐉',
            color: '#a855f7',
            size: 1.2
        }
    },

    // Create monster instance

    createMonster: (type, x, y) => {
        const template = Entities.Monsters[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            x: x,
            y: y,
            hp: template.hp,
            maxHp: template.maxHp,
            attack: template.attack,
            defense: template.defense,
            xp: template.xp,
            gold: template.gold,
            symbol: template.symbol,
            color: template.color,
            size: template.size,
            alive: true
        };
    },

});
