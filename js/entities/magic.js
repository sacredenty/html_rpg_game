// Magic
Object.assign(Entities, {
    Spells: {
        arcaneBolt: {
            name: 'Arcane Bolt',
            description: 'Deal magic-based damage to a nearby enemy.',
            manaCost: 8,
            power: 2,
            range: 6,
            type: 'damage',
            color: '#a78bfa'
        },
        flameBurst: {
            name: 'Flame Burst',
            description: 'Deal heavy magic-based damage to a nearby enemy.',
            manaCost: 16,
            power: 3,
            range: 4,
            type: 'damage',
            color: '#fb923c'
        },
        healingLight: {
            name: 'Healing Light',
            description: 'Restore HP based on your Magic stat.',
            manaCost: 12,
            type: 'heal',
            baseHealing: 20,
            healingPerMagic: 2,
            color: '#34d399'
        }
    },

    // Tile Biomes

    Biomes: {
        forest: 'forest',
        mountain: 'mountain',
        desert: 'desert',
        dungeon: 'dungeon'
    }
});
