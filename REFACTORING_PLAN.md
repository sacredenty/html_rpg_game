# Refactoring Plan for HTML RPG Game

## Goal: Modularize and maintain the codebase

## Current Issues Identified:
1. **game.js (2188 lines)** - Single Game object contains too much responsibility
2. **js/ folder** - Uses old-style global objects instead of ES6 modules
3. **Empty subdirectories** in js/core/, js/entities/systems/, js/entities/utils/ suggest intended modular structure
4. **src/ui/** - Empty, needs UI component hierarchy
5. **Monolithic entity system** in entities.js

## Proposed New Architecture:

### src/
```
src/
├── core/               # Core game loop, state management
│   ├── GameLoop.js    # Main game loop controller
│   ├── GameState.js   # Global state manager
│   └── EventBus.js    # Event system for loose coupling
│
├── entities/          # Entity systems and managers
│   ├── Player.js      # Player class and behavior
│   ├── Monster.js     # Monster base class and behaviors
│   ├── Item.js        # Item base class and types
│   └── NPC.js         # NPC base class and behaviors
│
├── systems/           # Game subsystems
│   ├── CombatSystem.js # Combat mechanics
│   ├── QuestSystem.js  # Quest tracking and management
│   ├── MovementSystem.js # Entity movement and pathfinding
│   ├── InventorySystem.js # Player inventory management
│   └── EquipmentSystem.js # Weapon, armor handling
│
├── ui/                # UI components
│   ├── HUD.js         # Heads-up display (health, mana, stats)
│   ├── DialogueBox.js # Combat dialogue system
│   ├── InventoryUI.js # Inventory screen UI
│   ├── ShopUI.js      # Shop interface UI
│   ├── QuestLogUI.js  # Quest tracking UI
│   └── WorldMapUI.js  # World map display
│
├── input/             # Input handling
│   ├── Keyboard.js    # Keyboard input processing
│   ├── Mouse.js       # Mouse input processing
│   └── Controls.js    # Combined input handler
│
└── canvas/            # Canvas rendering
    ├── Renderer.js    # Main renderer
    ├── Camera.js      # Camera tracking and viewport
    └── TileRenderer.js # Tile-based rendering
```

### Migration from js/ to src/:
- `js/game.js` → Split across multiple modules in src/core/, src/systems/, src/ui/
- `js/entities.js` → Refactored into src/entities/*.js
- `js/combat.js` → src/systems/CombatSystem.js
- `js/quest.js` → src/systems/QuestSystem.js
- `js/sprites.js` → src/canvas/TileRenderer.js (sprite rendering)
- `js/audio.js` → Keep as-is or move to src/utils/AudioManager.js
- `js/utils.js` → src/utils/helpers.js + other helpers

## Benefits:
1. **Separation of concerns** - Each file has a single responsibility
2. **Testability** - Isolated systems can be tested independently  
3. **Maintainability** - Smaller files are easier to navigate and modify
4. **Reusability** - Systems can be reused across different game modes
5. **Better organization** - Clear boundaries between concerns

## Implementation Steps:
1. [ ] Create directory structure in src/
2. [ ] Extract core game loop from game.js
3. [ ] Extract combat system
4. [ ] Extract quest system
5. [ ] Refactor entities into separate classes
6. [ ] Create UI component hierarchy
7. [ ] Set up input handling layer
8. [ ] Implement renderer with camera
9. [ ] Migrate from globals to ES6 modules (if needed)
10. [ ] Update imports/exports throughout
11. [ ] Test functionality at each step
