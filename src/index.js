/**
 * Entry Point - Modern ES6 module version of the game
 * This is the new main entry point after refactoring
 */

import GameLoop from './core/GameLoop.js';
import GameState from './core/GameState.js';
import Main from './core/Main.js';
import WorldGenerator from './core/WorldGenerator.js';

import Player from './entities/Player.js';
import Monster from './entities/Monster.js';

import CombatSystem from './systems/CombatSystem.js';
import QuestSystem from './systems/QuestSystem.js';

import HUD from './ui/HUD.js';
import DialogueBox from './ui/DialogueBox.js';

import Keyboard from './input/Keyboard.js';
import Mouse from './input/Mouse.js';
import InputHandler from './input/InputHandler.js';

import Renderer from './canvas/Renderer.js';
import Camera from './canvas/Camera.js';
import SpriteAtlas from './canvas/SpriteAtlas.js';

import Utils from './utils/helpers.js';
import AudioManager from './utils/AudioManager.js';

// Also export for module system discovery
export {
    GameLoop,
    GameState,
    Main,
    WorldGenerator,
    
    Player,
    Monster,
    
    CombatSystem,
    QuestSystem,
    
    HUD,
    DialogueBox,
    
    Keyboard,
    Mouse,
    InputHandler,
    
    Renderer,
    Camera,
    SpriteAtlas,
    
    Utils,
    AudioManager
};

// Make some key exports available globally for backward compatibility
if (typeof window !== 'undefined') {
    window.Game = Main; // For browser console access during development
}

console.log('[Refactored Game] Entry point loaded successfully!');
