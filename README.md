# Medieval RPG Adventure - Ultima Inspired Web Game

A browser-based role-playing game inspired by classic RPGs like Ultima, featuring tile-based exploration, character progression, combat, quests, and an immersive medieval world!

## Features

### Core Gameplay
- **Tile-Based Exploration**: Explore a world that expands as you cross the edge of the current region
- **Original Pixel-Art Sprites**: Crisp, colorful 16-bit-era-inspired terrain and character sprites
- **Original Fantasy Audio**: Synthesized looping soundtrack and sound effects, with separate music/effects toggles
- **Character Stats System**: Develop your hero's Strength, Magic, Endurance, and Agility
- **Leveling System**: Gain experience points and level up to increase stats
- **Combat Mechanics**: Fight monsters with turn-based combat system
- **Inventory Management**: Collect items, potions, and equipment
- **Quest System**: Complete various quests for rewards

### World Elements
- **Multiple Biomes**: Forest, Mountain, Desert, and Dungeon areas
- **Monster Types**: Slimes, Goblins, Orcs, Wolves, Skeletons, Dragons, and more
- **NPCs**: Villagers, King Alaric (main quest giver), Merchants, and shopkeepers
- **Items**: Health potions, mana potions, weapons, armor, and accessories

### Progression
- **Stats System**: Strength affects attack power, Magic for spells, Endurance for HP/defense
- **Equipment Slots**: Weapon, Armor, and Accessory slots
- **Quest Rewards**: Gain XP, gold, and unlock new areas

## Getting Started

### Simple Launch
1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. Start exploring the medieval world!

### In VS Code
The game runs directly in the browser - no build step needed! Just open `index.html`.

## Controls & Actions

### Action Buttons
- **✨ Explore**: Move your hero and discover new areas
- **Movement Turns**: Monsters and NPCs may wander when you successfully move
- **Expanding World**: The fixed-size viewport follows you into procedurally generated countryside, towns, streams, lakes, and mountain ranges
- **⚔️ Attack**: Fight nearby monsters for XP and gold
- **💤 Rest**: Restore HP (heals 15-25 HP)
- **💾 Save Game**: Save your progress to browser storage
- **📂 Load Game**: Load a previously saved game
- **🎵 Audio**: Toggle the synthesized soundtrack and sound effects independently

### Sidebar Panels
- **Character Stats**: View your hero's attributes with progress bars
- **Inventory**: See collected items. Click "Use Item" to use a random item
- **Quest Log**: Track active and completed quests
- **Spellbook**: Cast damage and healing spells using MP
- **Audio**: Control background music and sound effects

## Game Guide

### Basic Gameplay
1. **Start Exploring**: Use the Explore button to move your character around the world
2. **Encounter Enemies**: Monsters will appear when you get close to them
3. **Fight for XP**: Attack monsters to gain experience points
4. **Level Up**: Increase stats and max HP/MP by leveling up
5. **Collect Items**: Find potions and weapons scattered throughout the world
6. **Complete Quests**: Take on quests from NPCs for valuable rewards

### Monster Types & Difficulty

| Monster | HP | Attack | XP | Gold | Symbol |
|---------|-----|--------|----:|-------:|--------|
| Slime | 30 | 3 | 20 | 5 | 🟢 |
| Wolf | 40 | 7 | 30 | 8 | 🐺 |
| Goblin | 50 | 6 | 35 | 10 | 👺 |
| Skeleton | 45 | 8 | 40 | 12 | 💀 |
| Orc Warrior | 80 | 10 | 60 | 20 | 👹 |
| Dragon | 300 | 25 | 500 | 500 | 🐉 |

### Item Types

| Item | Effect | Symbol |
|------|--------|--------|
| Health Potion | +30 HP | 🧪 |
| Mana Potion | +25 MP | 💜 |
| Iron Sword | +3 Strength | ⚔️ |
| Wooden Shield | +2 Defense | 🛡️ |
| Gold Ring | +5 Gold/day | 💍 |

### Quest Types

1. **Collect Quests**: Gather specific items (herbs, legendary weapons)
2. **Kill Quests**: Defeat a certain number of monster types
3. **Main Story Quests**: Complete the King's requests

### World Areas

- **Forest (Top)**: Early game area with slimes and wolves
- **Town (Left)**: NPC locations including King, Merchant, Villagers
- **Mountain (Right)**: Higher level monsters like goblins and orcs
- **Dungeon (Bottom)**: Final area with skeletons and the Dragon

## Saving Your Progress

The game automatically saves when you die and allows manual saving:

1. Click "Save Game" to save your current progress
2. Games are stored in your browser's localStorage
3. There is one save slot; each save (including the automatic save on death) replaces it
4. Click "Load Game" to restore that save

## Technical Details

- **Rendering**: HTML5 Canvas with tile-based grid system
- **Storage**: Browser localStorage for persistence
- **No Dependencies**: Pure JavaScript, runs in any modern browser
- **Responsive Design**: CSS-styled UI with responsive controls

## File Structure

```
html_rpg_game/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styles and UI
├── js/
│   ├── utils.js        # Utility functions
│   ├── entities.js     # Player, monsters, items, NPCs
│   ├── quest.js        # Quest system
│   ├── game.js         # World, movement, UI, and rendering
│   ├── combat.js       # Combat and spellcasting
│   ├── sprites.js      # Original pixel-art terrain, item, and character rendering
│   └── audio.js        # Synthesized soundtrack and sound effects
```

## Browser Compatibility

Works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Tips for New Players

1. **Don't Overextend**: Stay near the town area until you're stronger
2. **Use Potions Wisely**: Save health potions for tough fights
3. **Check Quests First**: Some quests may give valuable items
4. **Level Up is Important**: Your stats increase every level
5. **Save Often**: Use save/load to avoid losing progress

## Advanced Features

- **Equipment System**: Slots for weapon, armor, and accessories
- **Stat Scaling**: Stats scale with character levels
- **XP Progression**: Exponential XP requirements for leveling
- **Quest Tracking**: Multiple quest lines with completion rewards

## Future Enhancements (Not Implemented)

- Spellcasting system
- Crafting system
- Character portraits
- Sound effects
- Animated sprites
- Boss battles
- Multiplayer support

## Credits

Inspired by classic RPGs like Ultima, Wizardry, and early D&D games.

## License

This project is for educational purposes. Feel free to modify and extend!

---

**Enjoy your adventure!** 🎮⚔️✨
