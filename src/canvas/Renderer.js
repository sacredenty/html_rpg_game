/**
 * Renderer - Handles all canvas rendering for the game
 */

const Renderer = {
    TILE_SIZE: 40,
    CHUNK_WIDTH: 38,
    CHUNK_HEIGHT: 22,
    
    /**
     * Render a single frame
     */
    render(game) {
        if (!game || !game.canvas || !game.ctx) return;
        
        const ctx = game.ctx;
        const canvas = game.canvas;
        const camera = game.camera || { x: 0, y: 0 };
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save context and translate for camera offset
        ctx.save();
        ctx.translate(-camera.x * Renderer.TILE_SIZE, -camera.y * Renderer.TILE_SIZE);
        
        // Draw all visible layers in order (back to front)
        Renderer.drawTerrain(game);
        Renderer.drawItems(game);
        Renderer.drawNPCs(game);
        Renderer.drawMonsters(game);
        Renderer.drawHero(game);
        
        // Restore context
        ctx.restore();
    },

    /**
     * Check if entity is within viewport
     */
    isInViewport(entity, cameraX, cameraY, viewWidth, viewHeight) {
        return entity.x >= cameraX && entity.x < cameraX + viewWidth &&
               entity.y >= cameraY && entity.y < cameraY + viewHeight;
    },

    /**
     * Draw terrain tiles
     */
    drawTerrain(game) {
        const ctx = game.ctx;
        const map = game.map || [];
        const cameraX = game.camera?.x || 0;
        const cameraY = game.camera?.y || 0;
        
        for (let y = 0; y < game.viewHeight; y++) {
            for (let x = 0; x < game.viewWidth; x++) {
                const worldX = cameraX + x;
                const worldY = cameraY + y;
                const tileType = map[worldY]?.[worldX]?.type;
                
                if (tileType) {
                    Renderer.drawTile(ctx, worldX, worldY, tileType);
                } else {
                    // Default grass/floor tile
                    ctx.fillStyle = '#2d5016';
                    ctx.fillRect(worldX * Renderer.TILE_SIZE, worldY * Renderer.TILE_SIZE, 
                                 Renderer.TILE_SIZE, Renderer.TILE_SIZE);
                }
            }
        }
    },

    /**
     * Draw a single tile type
     */
    drawTile(ctx, x, y, type) {
        const tileSize = Renderer.TILE_SIZE;
        const left = x * tileSize;
        const top = y * tileSize;

        switch (type) {
            case 'river':
            case 'lake':
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(left, top, tileSize, tileSize);
                // Add wave detail
                ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(left + 8, top + 14);
                ctx.quadraticCurveTo(left + 20, top + 8, left + 32, top + 14);
                ctx.moveTo(left + 5, top + 29);
                ctx.quadraticCurveTo(left + 18, top + 23, left + 30, top + 29);
                ctx.stroke();
                break;
                
            case 'bridge':
                ctx.fillStyle = '#92400e';
                ctx.fillRect(left, top, tileSize, tileSize);
                // Bridge railing
                ctx.strokeStyle = '#fcd34d';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(left + 3, top + 12);
                ctx.lineTo(left + tileSize - 3, top + 12);
                ctx.moveTo(left + 3, top + 28);
                ctx.lineTo(left + tileSize - 3, top + 28);
                ctx.stroke();
                break;
                
            case 'mountain':
                ctx.fillStyle = '#6b7280';
                ctx.fillRect(left, top, tileSize, tileSize);
                ctx.font = `${tileSize * 0.8}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⛰️', left + tileSize / 2, top + tileSize / 2);
                break;
                
            case 'town':
            case 'road':
                ctx.fillStyle = type === 'road' ? '#a16207' : '#4b7351';
                ctx.fillRect(left, top, tileSize, tileSize);
                if (type === 'road') {
                    ctx.fillStyle = 'rgba(253, 230, 138, 0.45)';
                    ctx.fillRect(left + 4, top + 4, tileSize - 8, tileSize - 8);
                }
                break;
                
            case 'house':
                ctx.fillStyle = '#78350f';
                ctx.fillRect(left + 5, top + 13, tileSize - 10, tileSize - 15);
                // Roof
                ctx.fillStyle = '#b91c1c';
                ctx.beginPath();
                ctx.moveTo(left + 2, top + 15);
                ctx.lineTo(left + tileSize / 2, top + 2);
                ctx.lineTo(left + tileSize - 2, top + 15);
                ctx.closePath();
                ctx.fill();
                break;
        }
    },

    /**
     * Draw all items in the world
     */
    drawItems(game) {
        const ctx = game.ctx;
        
        (game.items || []).filter(item => item.alive && Renderer.isInViewport(
            item, game.camera?.x, game.camera?.y, 
            game.viewWidth, game.viewHeight
        )).forEach(item => {
            Renderer.drawItem(ctx, item.x, item.y, item.type);
        });
    },

    /**
     * Draw an item
     */
    drawItem(ctx, x, y, itemType) {
        const tileSize = Renderer.TILE_SIZE;
        
        // Simple item representation
        ctx.fillStyle = '#ffd700'; // Gold/yellow for items
        ctx.beginPath();
        ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 
                 tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    },

    /**
     * Draw all NPCs
     */
    drawNPCs(game) {
        const ctx = game.ctx;
        
        (game.npcs || []).filter(npc => npc.alive && Renderer.isInViewport(
            npc, game.camera?.x, game.camera?.y, 
            game.viewWidth, game.viewHeight
        )).forEach(npc => {
            Renderer.drawNPC(ctx, npc.type, npc.x, npc.y);
        });
    },

    /**
     * Draw an NPC
     */
    drawNPC(ctx, type, x, y) {
        const tileSize = Renderer.TILE_SIZE;
        
        // Simple NPC representation (can be enhanced with sprites)
        ctx.font = `${tileSize * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        switch(type) {
            case 'king':
                ctx.fillText('👑', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'merchant':
                ctx.fillText('💰', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            default:
                ctx.fillText('👤', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
        }
    },

    /**
     * Draw all monsters
     */
    drawMonsters(game) {
        const ctx = game.ctx;
        
        (game.monsters || []).filter(monster => monster.alive && Renderer.isInViewport(
            monster, game.camera?.x, game.camera?.y, 
            game.viewWidth, game.viewHeight
        )).forEach(monster => {
            Renderer.drawMonster(ctx, monster.type, monster.x, monster.y);
        });
    },

    /**
     * Draw a monster
     */
    drawMonster(ctx, type, x, y) {
        const tileSize = Renderer.TILE_SIZE;
        
        // Simple monster representation (can be enhanced with sprites)
        ctx.font = `${tileSize * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        switch(type) {
            case 'slime':
                ctx.fillText('💚', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'goblin':
                ctx.fillText('👺', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'wolf':
                ctx.fillText('🐺', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'orc':
                ctx.fillText('👹', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'skeleton':
                ctx.fillText('💀', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            case 'dragon':
                ctx.fillText('🐉', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
                break;
            default:
                ctx.fillText('👾', x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
        }
    },

    /**
     * Draw the hero/player
     */
    drawHero(game) {
        const ctx = game.ctx;
        const player = game.player;
        
        if (player && !game.camera?.followPlayer) return; // Don't draw if not tracking
        
        const tileSize = Renderer.TILE_SIZE;
        ctx.font = `${tileSize * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw hero with weapon indicator if equipped
        let heroEmoji = '⚔️';
        if (player?.equipment?.weapon) {
            const weaponName = player.equipment.weapon.name || 'sword';
            switch(weaponName.toLowerCase()) {
                case 'legendarySword':
                    heroEmoji = '🗡️'; // Epic weapon
                    break;
                default:
                    heroEmoji = '⚔️';
            }
        } else {
            heroEmoji = '🧑‍🦱'; // Generic hero
        }
        
        ctx.fillText(heroEmoji, player.x * tileSize + tileSize / 2, 
                     player.y * tileSize + tileSize / 2);
    },

    /**
     * Draw grid lines overlay
     */
    drawGrid(game) {
        const ctx = game.ctx;
        const cameraX = game.camera?.x || 0;
        const cameraY = game.camera?.y || 0;
        
        ctx.strokeStyle = 'rgba(24, 31, 45, 0.14)';
        ctx.lineWidth = 1;
        
        for (let x = cameraX; x <= cameraX + game.viewWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * Renderer.TILE_SIZE, 0);
            ctx.lineTo(x * Renderer.TILE_SIZE, 
                       (cameraY + game.viewHeight) * Renderer.TILE_SIZE);
            ctx.stroke();
        }
        
        for (let y = cameraY; y <= cameraY + game.viewHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * Renderer.TILE_SIZE);
            ctx.lineTo((cameraX + game.viewWidth) * Renderer.TILE_SIZE, 
                       y * Renderer.TILE_SIZE);
            ctx.stroke();
        }
    },

    /**
     * Draw terrain movement effect (visual when moving)
     */
    drawTerrainMovementEffect(game) {
        // Simplified - in full version would use particle system
        console.log('[Renderer] Terrain movement effect rendered');
    }
};

export default Renderer;
