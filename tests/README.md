# Playwright Tests for RPG Game

This directory contains Playwright tests for the HTML RPG game. The tests verify quest system functionality, game UI elements, combat system, and save/load features.

## Test Files

- `quest-system.spec.js` - Quest system tests including:
  - Quest board visibility
  - Main story quests availability
  - Side quests availability
  - Quest text readability (fixes for white-on-white issue)
  - Quest rewards display
  - Accept quest button functionality
  - Quest category colors

- `game-functionality.spec.js` - Game system tests including:
  - Player status bar visibility
  - Level, HP, and XP displays
  - Action buttons (Explore, Attack, Rest, Save, Load)
  - Panel accessibility (Inventory, Stats, Actions)
  - Game canvas visibility

- `combat-system.spec.js` - Combat tests (create if needed)
- `save-load.spec.js` - Save/load functionality tests (create if needed)

## Running Tests

### Basic Test Run
```bash
npm test
# or
npx playwright test
```

### Interactive UI Mode
Open the Playwright UI to run tests step-by-step with screenshots:
```bash
npm run test:ui
# or
npx playwright test --ui
```
Then open the URL shown in the terminal and select tests to run.

### Debug Mode
Run tests with detailed console output:
```bash
npm run test:debug
# or
npx playwright test --debug
```

### Run Tests Without Browser (Headless)
```bash
npx playwright test --headed=false
```

### View Test Reports
After running tests, open the HTML report:
```bash
npm run test:report
# or
npx playwright show-report
```
The report will be in `test-results/index.html`

## Test Structure

Each test file uses Playwright's test API:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Test Suite Name', () => {
    test.beforeEach(async ({ page }) => {
        // Setup code runs before each test
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        await page.waitForTimeout(2000);
    });

    test('Test Name', async ({ page }) => {
        // Test assertions here
        await expect(someElement).toBeVisible();
    });
});
```

## Test Categories

### Quest System Tests
- Verify quest board renders correctly
- Check main storyline quests are available
- Check side quests are available
- **Verify quest text is readable** (not white on white)
- Check quest rewards display properly
- Verify accept buttons are clickable
- Check quest category colors (red for main, purple for side)

### Game Functionality Tests
- Player status bar visibility
- Level display shows current level
- HP display shows health points
- XP bar visibility
- All action buttons are clickable
- Panel accessibility

### Combat System Tests
- Combat panel accessibility
- Enemy health bar display
- Damage numbers on hits
- Victory messages

### Save/Load Tests
- Save slots availability
- Confirmation dialogs
- Data persistence across reloads

## Writing New Tests

To add a new test:

1. Create a new file in the `tests/` directory
2. Use Playwright's test API
3. Follow the existing patterns
4. Test against real game behavior

Example:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('New Feature Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file:///home/chris/code/html_rpg_game/index.html');
        await page.waitForTimeout(2000);
    });

    test('Feature should work', async ({ page }) => {
        // Your test here
        await expect(someElement).toBeVisible();
    });
});
```

## Fixing Failing Tests

If tests fail due to timing issues:
- Increase `waitForTimeout()` duration
- Use `page.waitForSelector()` for specific elements
- Add `retry` option to playwright.config.js

Example:
```javascript
// In playwright.config.js
test: {
    retries: 2, // Retry failed tests twice
},
```

## CI/CD Integration

Tests can be run in CI environments:

```bash
# Run in CI mode (no retries, faster)
CI=true npm test
```

The Playwright configuration automatically adapts to CI environments.

## Troubleshooting

### "Element not found" errors
- Increase timeout in playwright.config.js
- Use `page.waitForSelector()` before interacting
- Check if the element actually exists in the DOM

### Timing issues
- Use `await page.waitForTimeout(ms)` for delays
- Or better: use explicit wait conditions with selectors

### File protocol issues
- Tests use `file:///` protocol to load the game
- Make sure all files are accessible from the file system

### Browser installation
- First run: `npx playwright install chromium --with-deps`
- Subsequent runs: Playwright will cache dependencies

## Best Practices

1. **Test visible elements** - Don't test internal implementation details
2. **Use descriptive names** - Test names should describe what's being tested
3. **Keep tests independent** - Each test should be able to run in any order
4. **Handle async properly** - Always await async operations
5. **Clean up after tests** - Reset game state if needed between tests

## Contributing

When adding new tests:
1. Add the test file to this README
2. Document what the test verifies
3. Include expected behavior in comments
4. Test against both main and side quests

## License

MIT License - Same as the main game project.
