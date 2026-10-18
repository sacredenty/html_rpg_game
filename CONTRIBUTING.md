# Contributing to RPG Adventure

Thank you for your interest in contributing to this Ultima-inspired RPG! This document will help you understand how to extend and modify the game.

## Project Structure

```
html_rpg_game/
├── index.html          # Main HTML file (entry point)
├── css/
│   └── style.css       # Game styles
├── js/
│   ├── utils.js        # Utility functions (easy to extend)
│   ├── entities.js     # Player, monsters, items, NPCs
│   ├── quest.js        # Quest system logic
│   ├── game.js         # World, movement, UI, and rendering
│   ├── combat.js       # Combat and spellcasting
│   ├── sprites.js      # Pixel-art terrain and character rendering
│   └── audio.js        # Synthesized soundtrack and sound effects
├── README.md           # User documentation
├── FEATURES.md         # Technical features documentation
└── CONTRIBUTING.md     # This file
```

## How to Extend the Game

### Adding New Monsters

1. Open `js/entities.js`
2. Add to the `Monsters` object:

```javascript
golem: {
    name: 'Golem',
    hp: 150,
    maxHp: 150,
    attack: 15,
    defense: 8,
    xp: 80,
    gold: 25,
    symbol: '🗿',
    color: '#78716c',
    size: 0.9
},
```

3. In `js/game.js`, add spawn logic in the `generateWorld()` function:
```javascript
this.spawnMonster('golem', x, y);
```

### Adding New Items

1. Open `js/entities.js`
2. Add to the `Items` object:

```javascript
magicStaff: {
    name: 'Magic Staff',
    description: '+10 Magic power',
    effect: () => ({ magic: 10 }),
    symbol: '🪄',
    color: '#a855f7'
},
```

### Creating New Quests

1. Open `js/quest.js`
2. Add to `questTemplates` array:

```javascript
{
    id: 'find_cursed_gem',
    name: 'Cursed Gem Quest',
    description: 'Find the cursed gem in the dungeon.',
    type: 'collect',
    target: 'cursedGem',
    quantity: 1,
    completed: false,
    reward: { xp: 150, gold: 200 }
},
```

### Adding New Biomes

1. Open `js/entities.js` and add to `Biomes` object
2. Update the world generation in `js/game.js` to include new biome areas
3. Add visual styling in `css/style.css` for biome-specific colors

### Modifying Combat Mechanics

Edit the `combat()` function in `js/combat.js`:

```javascript
// Current damage formula
const playerDamage = this.player.stats.strength * 1.5 + 
                    (this.equipment.weapon ? this.equipment.weapon.damage : 0);

// To add magic damage component:
const playerDamage = (this.player.stats.strength * 1.5 + 
                     (this.player.stats.magic * 0.8) +  // Magic damage component
                     (this.equipment.weapon ? this.equipment.weapon.damage : 0));
```

### Adding Spells

Add spell definitions to `Entities.Spells` in `js/entities.js`. Damage spells use
`type: 'damage'`, `manaCost`, `power`, `range`, and `color`; healing spells use
`type: 'heal'`, `manaCost`, `baseHealing`, and `healingPerMagic`. Implement their
effects in `js/combat.js`; the spellbook UI reads the definitions automatically.

Example spell structure:
```javascript
const Spells = {
    fireball: {
        name: 'Fireball',
        mpCost: 20,
        damage: 35,
        range: 3,
        cooldown: 10
    },
    heal: {
        name: 'Heal',
        mpCost: 15,
        healAmount: 40,
        target: 'self'
    }
};
```

### Styling Changes

Edit `css/style.css` to modify:
- Color schemes
- Font styles
- Layout adjustments
- Animation effects

Example: Change background gradient
```css
body {
    /* Old */
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    
    /* New - warmer tones */
    background: linear-gradient(135deg, #2d1810 0%, #4a2c1a 100%);
}
```

### Adding Sound Effects

1. Create audio files in `assets/sounds/` directory
2. Load sounds in `js/game.js`:
```javascript
const sounds = {
    attack: new Audio('sounds/attack.mp3'),
    victory: new Audio('sounds/victory.mp3')
};
```
3. Play sounds on events:
```javascript
this.attack();
if (monster.alive) {
    monster.alive = false;
    sounds.victory.play();  // Play sound
}
```

## Testing Your Changes

### Manual Testing
1. Open `index.html` in a browser
2. Test new features thoroughly
3. Check for console errors (F12 → Console)

### Common Issues

**Monster doesn't appear:**
- Verify spawn rate is > 0%
- Check if coordinates are in bounds

**Quest not completing:**
- Ensure quest ID matches exactly
- Check quantity thresholds are correct

**Game crashes on load:**
- localStorage might be full or disabled
- Clear cache and try again

## Code Style Guidelines

### Naming Conventions
- Classes: PascalCase (`Player`, `Monster`)
- Functions: camelCase (`spawnMonster`, `checkEncounters`)
- Constants: UPPER_SNAKE_CASE (`TILE_SIZE`, `MAX_LEVEL`)
- File names: lowercase with underscores (`game.js`, `utils.js`)

### Comments
```javascript
// Good: Clear intent
const damage = Math.max(1, playerDamage - monster.defense); // Minimum 1 damage

// Avoid: Vague comments
const x = 5; // arbitrary value
```

### Error Handling
```javascript
try {
    localStorage.setItem('rpg_save_slot_1', JSON.stringify(gameState));
} catch (error) {
    console.error('Failed to save game:', error);
    return false;
}
```

## Pull Request Checklist

Before submitting your changes:

- [ ] Code follows style guidelines
- [ ] All new features have documentation
- [ ] Game runs without errors in browser
- [ ] No console errors
- [ ] Save/load functionality works
- [ ] Quest system functions correctly
- [ ] UI displays properly

## Reporting Bugs

When reporting a bug, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshot if applicable

Example bug report:
```
**Bug**: Quest completion message doesn't appear

**Steps**:
1. Complete "Slime Hunter" quest (kill 10 slimes)
2. Notice no popup message appears
3. Quest moves to completed list without reward

**Expected**: XP and gold rewards shown with popup
**Actual**: Silent quest completion

**Browser**: Chrome 120.0.6099.109
```

## Feature Requests

Great ideas! Please submit as an issue with:
- Feature description
- Use case/example
- Potential implementation approach (optional)
- Priority level

## License

This project uses MIT License. Feel free to use code in your own projects!

## Contact

For questions or suggestions, open an issue or contact the maintainer.

---

Happy coding! 🎮⚔️✨
