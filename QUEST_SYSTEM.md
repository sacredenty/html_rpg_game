# Quest System Documentation

## Overview

The enhanced quest system now supports both **main storyline quests** and **side quests**, providing players with meaningful progression and optional challenges.

---

## Main Storyline Quests (⭐)

These quests form the core narrative of the game and are required for progression:

### 1. The King's Call
- **Description:** King Alaric seeks heroes to defend our realm from growing darkness.
- **Type:** Story/Dialogue
- **Reward:** +50 XP, 30 gold
- **Prerequisites:** None (start by talking to King Alaric)

### 2. Goblin Threat
- **Description:** Defeat 5 goblins harassing the villages on our borders.
- **Type:** Kill Quest
- **Reward:** +100 XP, 100 gold
- **Prerequisites:** The King's Call completed

### 3. Slime Clearing
- **Description:** Clear the forest of dangerous slimes before they spread.
- **Type:** Kill Quest
- **Reward:** +80 XP, 60 gold
- **Prerequisites:** Goblin Threat completed

### 4. The Legendary Sword
- **Description:** A legendary blade is needed to defeat the dark lord. Find it in the dungeon.
- **Type:** Collection Quest
- **Reward:** +200 XP, 300 gold
- **Prerequisites:** Slime Clearing completed

### 5. Dragon Slayer (Final Main Quest)
- **Description:** The great dragon has awakened. Defeat it before it consumes our world.
- **Type:** Kill Quest
- **Reward:** +500 XP, 1000 gold
- **Prerequisites:** The Legendary Sword completed

---

## Side Quests (✨)

Optional quests that provide additional rewards and content:

### Herb Gatherer
- **Description:** Collect 5 healing herbs for the village healers.
- **Type:** Collection
- **Reward:** +30 XP, 20 gold

### Slime Hunter
- **Description:** These pesky slimes need to be taught a lesson! Defeat 10 of them.
- **Type:** Kill Quest
- **Reward:** +50 XP, 30 gold

### Wolf Pack Problem
- **Description:** A wolf pack is terrorizing travelers. Wipe them out!
- **Type:** Kill Quest
- **Reward:** +90 XP, 70 gold

### Orc Hunting
- **Description:** Orcs are raiding the mountain passes. Stop them!
- **Type:** Kill Quest
- **Reward:** +120 XP, 90 gold

### Skeleton Slayer
- **Description:** Ancient skeletons haunt the dungeon. Purge them!
- **Type:** Kill Quest
- **Reward:** +150 XP, 120 gold

### Mana Hunter
- **Description:** Collect mana crystals to boost our magical reserves.
- **Type:** Collection
- **Reward:** +60 XP, 40 gold

### Villager's Request
- **Description:** An elderly villager needs help collecting firewood.
- **Type:** Collection
- **Reward:** +40 XP, 25 gold

---

## Quest Features

### Visual Indicators
- **Main Story quests** are marked with red borders and a star icon (⭐)
- **Side quests** are marked with purple borders and a sparkle icon (✨)

### UI Panels
The quest board displays three sections:
1. **In Progress** - Currently active quests showing progress
2. **Completed** - Finished quests with rewards claimed
3. **Available** - Quests you can accept (with Accept buttons)

### Prerequisite System
- Main storyline quests unlock automatically after completing prerequisites
- Side quests are available immediately (no prerequisites)
- Quest progress is saved and restored on game load

---

## How It Works

### Accepting a Quest
1. Visit the **Talk / Trade** NPC panel (near King Alaric or Merchant)
2. Browse available quests in the "Available Quests" section
3. Click **"Accept"** on any quest you want to take
4. The quest moves to "In Progress"

### Completing Objectives
- **Kill objectives:** Defeat the specified number of monsters
- **Collection objectives:** Gather the specified items
- **Talk objectives:** Speak with NPCs (currently for story intro)

Progress is tracked automatically:
- Killing monsters updates kill counts
- Picking up items adds to collection counts
- Quests auto-complete when objectives are fulfilled

### Rewards
Upon quest completion:
- XP is awarded (may trigger level up)
- Gold is added to your treasury
- Quest is moved to "Completed" history
- Main quest completion unlocks the next main storyline quest

---

## Technical Implementation

### Key Files
- `js/quest.js` - Core quest system logic
- `js/game.js` - Item pickup integration
- `js/combat.js` - Monster kill integration

### Quest System Functions

| Function | Description |
|----------|-------------|
| `init(player)` | Initialize quests on game start/load |
| `acceptQuest(questId)` | Accept a new quest |
| `completeObjective(questId, objective)` | Add progress toward quest goal |
| `completeQuest(questId)` | Complete a finished quest (auto-called) |
| `getAvailableQuests()` | Get quests you can accept now |
| `renderAllQuests()` | Refresh all quest UI panels |

### Save System Integration
Quest progress is automatically saved to localStorage:
- Active quest states (accepted, progress, objectives completed)
- Completed quests list
- Kill counts and collection counts
- Save data persists across game sessions

---

## Tips for Players

1. **Start with the main story** - Talk to King Alaric first to begin your journey
2. **Side quests are optional** - Complete them whenever you want extra XP/gold
3. **Kill quests stack** - Killing slimes counts for both main and side slime quests
4. **Collection quests share items** - Picking up herbs helps multiple collection quests
5. **Save often!** - Quest progress is automatically saved

---

## For Developers

### Adding New Quests

To add a new quest, edit `js/quest.js`:

```javascript
// Add to mainStorylineQuests or sideQuests array
{
    id: 'unique_quest_id',
    name: 'Quest Name',
    description: 'What the player sees',
    type: 'kill' | 'collect' | 'story',
    category: 'main' | 'side',
    reward: { xp: 50, gold: 100 },
    prerequisites: ['quest_id'] or [] for no prerequisites,
    objectives: [
        { type: 'kill', target: 'monster_type', quantity: 5, description: '...' }
    ],
    completed: false
}
```

### Quest Types

- **Kill quests:** Track monster kills via `playerKillCounts`
- **Collection quests:** Track item pickups via `playerCollections`
- **Story quests:** Track dialogue flags via `objectivesCompleted` array

---

## Future Enhancements

Potential additions for future updates:
- Daily quests that reset
- Faction-based quest lines
- Multi-objective quests with branching paths
- Quest reputation system
- Dynamic quest availability based on world state
