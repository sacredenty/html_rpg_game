# Game Features & Mechanics

## Character Stats System

### Primary Attributes
- **Strength**: Determines physical attack power
  - Base: 10, +2 per level
  - Damage formula: `(Strength × 1.5) - Enemy Defense`
  
- **Magic**: Increases spell damage and healing
  - Base: 10, +2 per level
  
- **Endurance**: Affects defense and HP pool
  - Base: 10, +1 per level
  - Reduces incoming damage by this amount

- **Agility**: Movement and evasion (expansion-ready)
  - Base: 10, +1 per level

### Health & Mana
- **HP Pool**: 100 base, +20 per level
- **MP Pool**: 50 base, +10 per level; spells consume MP
- **XP Requirements**: Scale by 1.5x each level; unused XP carries over, including across multiple levels earned at once
- **XP Display**: Header progress bar shows current XP toward the next level

## Combat System

### World Movement
- Living monsters and NPCs each have a 50% chance to wander up to one tile after a successful hero move
- Movers avoid blocked terrain, items, the hero, and other living monsters or NPCs
- Failed movement does not advance roaming characters

### Pixel-Art Rendering
- The game uses original, hand-authored pixel patterns and limited retro-inspired color palettes for characters, monsters, items, and terrain
- Sprite definitions and canvas drawing helpers are in `js/sprites.js`

### Audio
- An original looping fantasy soundtrack and gameplay sound effects are synthesized with the Web Audio API
- Music and effects can be toggled independently in the Audio panel
- Audio starts on the first user gesture to comply with browser autoplay restrictions
- Movement, blocked movement, pickups, attacks, hits, spellcasting, healing, and victories have distinct cues

### Expanding World
- The canvas remains a fixed 38x22-tile viewport and follows the hero
- Crossing any explored-world edge adds a new region in that direction
- Newly discovered regions contain streams with bridges, lakes, mountain clusters, scattered encounters, and occasional towns with merchants and villagers
- Explored terrain, characters, and items remain in place when the world expands and are included in save data
- Grass is the default terrain, so saves store only non-grass tiles to keep expanding maps compact

### Turn-Based Combat
1. Player chooses to attack nearby enemies
2. Damage calculated as: `(Player Strength × 1.5) - Enemy Defense`
3. Monster attacks back with 30% chance per turn
4. Monster damage: `(Monster Attack × 1.2) - Player Endurance`

### Combat Feedback
- Damage numbers appear above targets
- Health bars update in real-time
- Victory/defeat messages displayed

### Spellcasting
- **Arcane Bolt**: 8 MP; magic-based damage to an enemy within 6 tiles
- **Flame Burst**: 16 MP; stronger magic-based damage to an enemy within 4 tiles
- **Healing Light**: 12 MP; restores HP based on the Magic stat
- Damage spells automatically target the nearest enemy in range; surviving targets may retaliate
- Mana potions restore MP for further casting

## Inventory System

### Item Collection
- Items spawn throughout the world; healing herbs and the legendary sword also have guaranteed locations
- Items are picked up automatically when the hero moves onto or next to them
- Stored in inventory until used

### Item Categories

#### Consumables
- **Health Potions**: Restore 30 HP
- **Mana Potions**: Restore 25 MP

#### Equipment
- **Weapons**: Increase Strength stat
- **Armor**: Increase Defense stat
- **Accessories**: Various passive bonuses

### Item Usage
- Use consumables from the inventory, or use "Use Item" to choose a random consumable
- Equipment is equipped and unequipped from its matching slot
- Consumables are consumed after use

## Quest System

### Quest Types

#### Collection Quests
```
Example: Find 5 Healing Herbs
- Type: collect
- Target: herb
- Quantity: 5
- Reward: +30 XP, +20 gold
```

#### Kill Quests
```
Example: Slime Hunter
- Type: kill
- Target: slime
- Quantity: 10
- Reward: +50 XP, +30 gold
```

#### Main Story Quests
- **King's Quest**: Save the village from goblin invasion
- **Dragon Slayer**: Defeat the dragon guarding the treasure
- **Legendary Weapon**: Find the legendary sword in the dungeon

### Quest Progression
1. Talk to King Alaric and accept available quests
2. Track progress by collecting quest items or defeating target monsters
3. Receive XP and gold rewards automatically when objectives are complete
4. Completed quests are recorded in the quest log and saved with the game

### Merchant
- Talk to the Merchant in town to open the shop
- Buy consumables and equipment with collected gold
- Sell unequipped inventory items for half their shop price
- Shop purchases, sales, and gold balances persist through the existing save data

## World Generation

### Map Dimensions
- Width: 50 tiles
- Height: 30 tiles
- Tile size: 40x40 pixels

### Biome Distribution
- **Forest (Top)**: Levels 1-5 equivalent
  - Common: Slimes, Wolves
  - Rare: Health potions
  
- **Mountain (Right)**: Levels 6-10 equivalent
  - Common: Goblins, Orcs
  - Rare: Mana potions, weapons

- **Town (Left)**: Safe zone with NPCs
  - King Alaric (main quest giver)
  - Merchant (item sales - expansion)
  - Villagers (dialogue)

- **Dungeon (Bottom)**: Levels 11+ equivalent
  - Common: Skeletons, Orcs
  - Rare: Legendary items, Dragon

### Terrain Obstacles
- A meandering river blocks movement except at its wooden bridge.
- Mountain tiles block movement, with open routes between peaks.
- Items, monsters, and NPCs do not spawn on blocked terrain.
- Terrain is saved and restored with the map.

### Spawn Rates
- Monsters: 15% chance per tile
- Items: 8% chance per tile
- NPCs: Fixed locations
- Dragon: Placed in the southeastern dungeon
- Five healing herbs and the legendary sword are guaranteed world pickups

## Progression System

### Leveling Up
Upon gaining enough XP:
1. Level increases by 1
2. All stats increase (+2 Str/Mag, +1 End/Agi)
3. HP and MP pools increase
4. Full heal on level up
5. XP requirement for next level scales by 1.5x
6. Excess XP carries forward, and a single reward can grant multiple levels

### Equipment System
Equipment drops can be collected and equipped in three slots:
1. **Weapon**: Iron Sword (+3 Strength)
2. **Armor**: Wooden Shield (+2 Defense), Leather Armor (+2 Defense), or Chainmail (+4 Defense)
3. **Accessory**: Gold Ring (+5 gold when resting), Silver Ring (+10 gold when resting), or Lucky Charm (+2 Strength)

Equipment appears as random world loot and can be equipped from the inventory panel.

## Save/Load System

### Save Format
```javascript
{
  player: PlayerObject,
  monsters: [Monster1, Monster2, ...],
  items: [Item1, Item2, ...],
  npcs: [NPC1, NPC2, ...],
  terrain: [[x, y, type], ...],
  width: worldWidth,
  height: worldHeight,
  viewWidth: 38,
  viewHeight: 22
}
```

Older saves containing a full `map` grid are still supported.

### Save Locations
- Stored in browser localStorage
- Key: `rpg_save`
- Persists across browser sessions

### Load Features
- Restores exact game state
- All monsters, items, and NPCs restored
- Player position and stats preserved

## UI Components

### Status Bar
- Displays: Name | HP/Max | MP/Max | Level | Gold
- Updates in real-time

### Canvas Display
- Grid-based tile system
- Entities drawn as colored circles with symbols
- Health bars below player

### Action Buttons
- **Explore**: Random movement + encounter check
- **Attack**: Target nearby enemies
- **Rest**: Heal 15-25 HP
- **Talk / Trade**: Speak to nearby NPCs, accept quests from the King, and open the Merchant shop
- **Save Game**: Manual save
- **Load Game**: Load previous save

### Sidebar Panels
1. **Stats Panel**: Current attributes with progress bars
2. **Inventory Panel**: Collected items list
3. **Quest Log**: Active and completed quests
4. **Actions Panel**: Game action buttons

## Performance Considerations

### Rendering
- Canvas-based for smooth 60fps
- Efficient entity management
- Minimal DOM updates

### Memory Usage
- Player object: ~2KB
- Monster array: ~50 bytes each
- Item array: ~30 bytes each
- Total memory: <10MB for full game state

## Expansion Possibilities

### Spell System (Ready to Add)
```javascript
// Example spell structure
const Spells = {
  fireball: {
    name: "Fireball",
    cost: 20, // MP
    damage: 35,
    range: 3,
    cooldown: 10
  }
};
```

### Crafting System
- Combine items to create new ones
- Smithing for weapon upgrades
- Alchemy for potion creation

### Dialogue System
- Extended NPC conversations
- Reputation system
- Branching quest lines

### Multiplayer
- Shared world instance
- Cooperative/competitive modes
- Chat system

## Technical Architecture

### Module Structure
- `utils.js`: Core utility functions
- `entities.js`: Game entity classes
- `quest.js`: Quest management
- `game.js`: Main game loop and rendering

### State Management
- Single source of truth in Game object
- localStorage for persistence
- No external state managers needed

### Event Handling
- DOM event listeners for UI
- Canvas drawing commands for rendering
- Async operations via Promises
