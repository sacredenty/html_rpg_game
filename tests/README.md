# Playwright Tests

The Playwright suite checks character creation, the game interface, and quest
acceptance and persistence.

## Run the tests

```sh
npm test
```

The suite uses the configured Chromium project. To run it in headed mode or open
Playwright's interactive runner, use `npm run test:headed` or `npm run test:ui`.

## Test files

- `create-character.spec.js` verifies the startup flow, name validation, class
  selection, and starting an adventure.
- `game-ui-simple.spec.js` verifies the active hero status, map, inventory, quest
  log, and action controls.
- `quest-system-simple.spec.js` verifies quest discovery, acceptance, and
  persistence when saving and loading.
- `helpers.js` shares the new-adventure setup and NPC interaction used by tests.

Tests clear browser local storage before starting an adventure and use paths
relative to the repository, so they do not depend on a specific checkout
location.
