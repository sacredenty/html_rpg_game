# Quick Start Guide - RPG Adventure

## Getting Started in 30 Seconds

### Option 1: Double-Click to Play (Easiest)
1. Navigate to the `html_rpg_game` folder
2. Double-click `index.html`
3. The game opens in your default browser!

### Option 2: VS Code Tasks (Recommended)
1. Open this project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Launch Game in Browser" or "Open in Default Browser"

### Option 3: Manual Launch
1. Open terminal in VS Code
2. Run: `code -n index.html --new-window --goto=index.html:1,1`
3. Or simply drag `index.html` to your browser

## First Steps in the Game

### Your Goal
Explore a medieval world, fight monsters, complete quests, and become a legendary hero! 🏆

### Basic Controls
- **Explore Button (✨)**: Move through the world and discover new areas
- **Attack Button (⚔️)**: Fight nearby monsters for XP and gold
- **Rest Button (💤)**: Heal your wounds (15-25 HP)
- **Save Game (💾)**: Save your progress anytime
- **Talk / Trade (💬)**: Interact with a nearby King or Merchant; you can also click an NPC on the map

### World Layout
```
┌─────────────────────────────┐
│  FOREST AREA                │  ← Top of screen
│  (Slimes, Wolves)           │   - Good for beginners
├─────────────────────────────┤
│                             │
│    TOWN (LEFT SIDE)         │  ← Safe zone with NPCs
│  King | Merchant | Villager │   - Start your quests here!
├─────────────────────────────┤
│                             │
│  MOUNTAIN AREA              │  ← Right side
│  (Goblins, Orcs)            │   - Higher level monsters
├─────────────────────────────┤
│                             │
│  DUNGEON (BOTTOM)           │  ← Final area
│  (Skeletons, Dragon)        │   - Boss battle waiting!
└─────────────────────────────┘
```

### Character Stats
- **HP (Health)**: Your life points. Start with 100/100
- **MP (Mana)**: Spells consume mana. Start with 50/50
- **Level and XP**: Defeat monsters and complete quests to earn XP; the progress bar shows how much XP is needed for your next level
- **Strength**: Physical attack power
- **Magic**: Increases spell damage and healing
- **Endurance**: Defense and HP pool

### Combat Tips
1. Stay near the town area until you level up a few times
2. Use health potions before taking damage
3. Leveling up increases your attributes and max HP/MP, then restores both pools!
4. Don't forget to save after defeating tough enemies
5. Cast Arcane Bolt or Flame Burst on nearby enemies, or use Healing Light when hurt

### Quest System
- Talk to King Alaric near the starting area to accept quests
- Quest progress appears in the sidebar and advances as you collect items or defeat monsters
- Quest XP and gold rewards are granted automatically on completion
- Click the Merchant on the map or move next to them and choose "Talk / Trade" to buy and sell items

## Common Questions

**Q: How do I get stronger?**
A: Fight monsters to gain XP, level up, and increase your stats. Find weapons in the world!

**Q: What happens when I die?**
A: Game over screen shows your final level. Your save is automatically stored. Load it to continue!

**Q: Can I save multiple games?**
A: No. The game has one save slot, and each manual save or automatic save on death replaces it.

**Q: Where can I find items?**
A: Items spawn randomly when you explore. Check the forest and mountain areas!

**Q: How do I equip weapons and armor?**
A: Collect an equipment item, then choose **Equip** beside it in the Inventory below the map. Equipped gear appears in the Equipment panel; use **Unequip** to return it to your inventory.

**Q: How do I use potions?**
A: Click the "Use" button beside a potion in the inventory, or click "Use Item" to use a random usable item.

## Keyboard Shortcuts (VS Code)

- `Ctrl+Shift+P`: Open command palette for tasks
- `Ctrl+S`: Save your work
- `F5`: Debug/Run game configuration

## Troubleshooting

**Game won't load?**
- Make sure you're opening `index.html`, not running from terminal
- Clear browser cache if items don't appear
- Check console (F12) for errors

**Can't save games?**
- Browser localStorage might be disabled
- Try a different browser
- Check privacy settings in browser

**Visual glitches?**
- Hard refresh the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Close and reopen the game

## Next Steps

After getting started, explore these features:

1. **Read FEATURES.md**: Deep dive into all game mechanics
2. **Check CONTRIBUTING.md**: Want to modify the game? Here's how!
3. **Explore the world**: Find all quest items and NPCs
4. **Complete quests**: Unlock legendary rewards!
5. **Fight the dragon**: The ultimate challenge awaits!

## Community & Support

- Report bugs by opening an issue
- Suggest features in the issues section
- Share your achievements with friends!

---

**May your journey be epic!** ⚔️🌟

For detailed documentation, see:
- `README.md` - Full feature overview
- `FEATURES.md` - Technical specifications  
- `CONTRIBUTING.md` - Extending the game
