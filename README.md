# Medieval RPG Adventure

A browser-based, tile-based RPG inspired by classic fantasy adventures. Explore an expanding world, fight monsters, cast spells, complete quests, collect equipment, and trade with merchants.

## Features

- **Exploration:** Move through a fixed 38 × 22 tile viewport that follows the hero. Crossing its world edge generates new regions with streams, bridges, lakes, mountains, roads, towns, NPCs, monsters, and items.
- **Original pixel art:** Hand-authored sprites and terrain rendered on an HTML canvas. A gold frame and pointer make the hero's position easy to identify.
- **Character progression:** Gain XP, level up, and improve Strength, Magic, Endurance, Agility, HP, and MP.
- **Hero creation:** Choose a hero name and one of three classes—Warrior, Mage, or Ranger—each with distinct starting attributes, health, mana, and spell access.
- **Combat:** Attack nearby enemies. Monsters may wander after successful movement and have a chance to attack when adjacent; monsters can also retaliate after surviving an attack or damage spell.
- **Spells:** Mages can cast Arcane Bolt, Flame Burst, and Healing Light; Rangers can cast Healing Light. Warriors have no MP or spell access.
- **Inventory and equipment:** Collect and use consumables, equip weapons, armor, and accessories, and manage three equipment slots.
- **Quests and trading:** Accept quests from King Alaric, track objectives, and buy or sell items with merchants.
- **Save/load:** Keep up to three adventures in browser local storage, including gold, character, inventory, world, and explored terrain. Slot 1 accepts older single-slot saves.
- **Fantasy audio:** An original synthesized looping soundtrack and gameplay sound effects, with separate music and effects toggles.

## Getting Started

Open `index.html` in a modern browser. No build step or external dependencies are required. Audio starts after the first click or key press to comply with browser autoplay policies.

At launch, choose **Continue Saved Game** when a save exists, or **Start New Adventure** to open the character creator.

To launch from VS Code, use the **Launch Game in Browser** or **Open in Default Browser** task if available in the workspace.

## Controls and Actions

On a new adventure, follow the character creator's three steps: enter a name, compare and choose a class, then review the hero before confirming. Use **Back** to revise earlier choices. Warriors specialize in strength and endurance and cannot cast spells; Mages have the most mana and can use every spell; Rangers are agile and can use Healing Light. Class and name are retained in saved games.

Use the directional buttons to move one tile, or **Explore** to move in a random direction. Successful movement may advance nearby NPCs and monsters. Blocked movement does not advance their turns.

| Action | What it does |
| --- | --- |
| **Attack** | Attacks the nearest living monster within 3 tiles. |
| **Cast Spell** | Casts an available class spell if the hero has enough MP and, for damage spells, an enemy is in range. |
| **Rest (HP)** | Restores 15–25 HP. |
| **Talk / Trade** | Interacts with the nearest NPC within 2 tiles. You can also click an NPC on the map. |
| **Save Game / Load Game** | Choose one of three browser-local save slots; overwriting a saved slot requires confirmation. |
| **Use / Equip** | Use a consumable or equip/unequip gear from the Inventory and Equipment panels. |
| **Music / Effects** | Toggle the synthesized soundtrack and sound effects independently. |

### Spells

| Spell | Cost | Effect |
| --- | ---: | --- |
| Arcane Bolt | 8 MP | Mage: magic damage to the nearest enemy within 6 tiles. |
| Flame Burst | 16 MP | Mage: heavy magic damage to the nearest enemy within 4 tiles. |
| Healing Light | 12 MP | Mage and Ranger: restores HP based on the hero's Magic stat. |

## Saving Progress

Use **Save Game** to choose one of three slots in browser local storage. Each slot shows its hero and level; overwriting an occupied slot requires confirmation. Loading restores that adventure. Death autosaves to the loaded slot, or asks for a slot if the hero has not been saved yet. A save includes the hero's stats, level, XP, inventory, equipment and quests, as well as monsters, NPCs, items, explored terrain and gold. Gold is also maintained in browser storage for gameplay and is restored from the save when loading.

Browser storage is tied to the browser and page origin. Clearing site data or using a different browser/profile may make the save unavailable.

## Project Structure

```text
html_rpg_game/
├── index.html          # Game UI and script loading
├── css/
│   └── style.css       # Layout, styling, and responsive UI
├── js/
│   ├── utils.js        # Shared utility and storage helpers
│   ├── entities.js     # Player, monsters, items, NPCs, spells
│   ├── quest.js        # Quest state and progression
│   ├── game.js         # World generation, movement, UI, save/load
│   ├── combat.js       # Combat and spellcasting
│   ├── sprites.js      # Canvas terrain, item, and character rendering
│   └── audio.js        # Synthesized music and sound effects
├── .vscode/            # Browser launch and debug configurations
├── FEATURES.md         # Detailed game mechanics
├── QUICKSTART.md       # Quick-start guide
└── CONTRIBUTING.md     # Project extension guide
```

## Development

The game uses plain JavaScript, HTML, CSS, the Canvas API, and the Web Audio API. It has no runtime package dependencies or build step. Run `npm test` to execute the Playwright suite for character creation, the game interface, and quest progression.

For a quick syntax check of the JavaScript modules:

```sh
for file in js/*.js; do node --check "$file"; done
```

## Inspiration and Art

The project takes inspiration from classic fantasy RPGs and uses original graphics and synthesized audio rather than assets from those games.
