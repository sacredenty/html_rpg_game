# Migration Guide: From js/ to src/

## Quick Start

The refactored code is ready in `src/`. Here's how to use it.

### Option 1: Gradual Migration (Recommended)

Use both old and new code simultaneously, gradually replacing `<script>` tags.

```html
<!-- Keep this during transition -->
<script src="js/game.js"></script>
<script src="js/entities.js"></script>
<script src="js/combat.js"></script>
<script src="js/quest.js"></script>

<!-- Add new modules after these -->
<script type="module">
    import Game from './src/core/Main.js';
    const game = new Game();
    await game.init();
</script>
```

### Option 2: Full Migration (Production)

Replace old script tags with the new entry point.

```html
<!-- Replace these two lines -->
<script src="js/game.js"></script>
<script src="js/entities.js"></script>

<!-- With this single line -->
<script type="module" src="./src/index.js"></script>
```

## File-by-File Migration

### Before → After

| Old File | New Location | Usage |
|----------|--------------|-------|
| `js/game.js` (2188 lines) | Split across modules | Import from specific submodules |
| `js/entities.js` (493 lines) | `src/entities/Player.js`, `src/entities/Monster.js` | Use ES6 classes |
| `js/combat.js` (184 lines) | `src/systems/CombatSystem.js` | `new CombatSystem(game)` |
| `js/quest.js` (560 lines) | `src/systems/QuestSystem.js` | `const q = new QuestSystem(game)` |
| `js/sprites.js` (493 lines) | `src/canvas/SpriteAtlas.js` + renderer | Use Renderer module |
| `js/audio.js` (182 lines) | `src/utils/AudioManager.js` | `AudioManager.play('move')` |
| `js/utils.js` (72 lines) | `src/utils/helpers.js` | Import and use helpers |

## Module Imports Example

### Old Code (from js/game.js):
```javascript
// Global objects
const player = new Entities.Player('Hero');
const combat = CombatSystem; // from global scope
const quest = QuestSystem;   // from global scope
```

### New Code (ES6 modules):
```javascript
import GameLoop from './src/core/GameLoop.js';
import Player from './src/entities/Player.js';
import CombatSystem from './src/systems/CombatSystem.js';
import QuestSystem from './src/systems/QuestSystem.js';

// Usage
const game = new Game();
await game.init(); // Initializes all modules
```

## Benefits of Migration

✅ **Modular** - Each module has single responsibility  
✅ **Testable** - Test individual modules in isolation  
✅ **Maintainable** - Files are 100-350 lines instead of 2000+  
✅ **Type-safe** - ES6 modules prevent namespace pollution  
✅ **Build-friendly** - Works with bundlers (Webpack, Vite, etc.)  

## Rollback Strategy

If you need to revert:

1. Keep `js/` directory as fallback
2. Git commit before migration
3. Old script tags already in `index.html` work if needed

## Testing Migration

```bash
# Test new modules work with old code
npm test

# Run specific tests
npx playwright test tests/refactoring.spec.js
```

## Common Import Patterns

### For the Game Object:
```javascript
// Before (in js/game.js)
const Game = { init() { ... } };

// After (import from new module)
import Main from './src/core/Main.js';
const game = new Main();
await game.init();
```

### For Player Entity:
```javascript
// Before
const player = new Entities.Player('Hero');

// After
import Player from './src/entities/Player.js';
const player = new Player('Hero', 'warrior');
```

## Updating package.json (Optional)

Add build scripts if using a bundler:

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "vite",
    "start": "node server.js || npm run serve"
  },
  "type": "module"
}
```

## Troubleshooting

### "Module not found" Error:
- Make sure all imports use correct relative paths
- Check that ES modules are enabled (`"type": "module"` in package.json)

### Global Objects Missing:
- Old code used global `Entities`, `QuestSystem` objects
- New code uses ES6 classes - initialize explicitly
- Add `<script type="module">` tags to use ES6

## Next Steps After Migration

1. Update `index.html` to load from `src/`
2. Remove unused files from `js/` folder
3. Update README.md with new architecture
4. Add CI/CD pipeline for testing
5. Consider adding TypeScript gradually

---

*Migration guide version 1.0 - Refactoring Complete*
