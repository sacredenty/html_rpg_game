// Movement game behavior
Object.assign(Game, {
    explore() {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        // Move in random direction
        const directions = [
            {dx: 0, dy: -1}, // up
            {dx: 0, dy: 1},  // down
            {dx: -1, dy: 0}, // left
            {dx: 1, dy: 0}   // right
        ];
        
        const direction = directions[Utils.random(0, directions.length - 1)];
        const destination = this.expandWorldToInclude(
            this.player.x + direction.dx,
            this.player.y + direction.dy
        );
        const newX = destination.x;
        const newY = destination.y;

        if (this.isBlockedTile(newX, newY)) {
            GameAudio.blocked();
            Utils.showMessage(this.getBlockedTerrainMessage(newX, newY), 'warning');
        } else {
            // Add visual feedback for movement
            this.renderMovementEffect(newX, newY);
            
            this.player.x = newX;
            this.player.y = newY;
            GameAudio.move();
            this.updateCamera();
            this.moveWorldEntities();
            
            // Show movement message
            Utils.showMessage(`Moved ${this.getDirectionText(direction)}`, 'info');
            
            // Check for encounters
            this.checkEncounters();
            
            // Try to collect nearby items
            this.tryCollectItem();
            this.monstersTurn();
        }

        this.render();
    },

    // Movement functions for directional buttons

    moveNorth() {
        this.movePlayer(0, -1);
    },

    moveSouth() {
        this.movePlayer(0, 1);
    },

    moveWest() {
        this.movePlayer(-1, 0);
    },

    moveEast() {
        this.movePlayer(1, 0);
    },

    // Generic movement function with direction text

    movePlayer(dx, dy) {
        if (this.player.hp <= 0) {
            Utils.showMessage('You are dead! Play a saved game.', 'error');
            return;
        }

        const destination = this.expandWorldToInclude(
            this.player.x + dx,
            this.player.y + dy
        );
        const newX = destination.x;
        const newY = destination.y;

        if (this.isBlockedTile(newX, newY)) {
            GameAudio.blocked();
            Utils.showMessage(this.getBlockedTerrainMessage(newX, newY), 'warning');
        } else {
            // Add visual feedback for movement
            this.renderMovementEffect(newX, newY);
            
            this.player.x = newX;
            this.player.y = newY;
            GameAudio.move();
            this.updateCamera();
            this.moveWorldEntities();
            
            // Show direction message
            const directionText = this.getDirectionText({dx, dy});
            Utils.showMessage(`Moved ${directionText}`, 'info');
            
            // Check for encounters
            this.checkEncounters();
            
            // Try to collect nearby items
            this.tryCollectItem();
            this.monstersTurn();
        }

        this.render();
    },

    moveWorldEntities() {
        const entities = Utils.shuffle([
            ...this.monsters.filter(monster => monster.alive),
            ...this.npcs.filter(npc => npc.alive)
        ]);
        const occupiedTiles = new Map();
        const addOccupant = entity => {
            const key = `${entity.x},${entity.y}`;
            occupiedTiles.set(key, (occupiedTiles.get(key) || 0) + 1);
        };
        const removeOccupant = entity => {
            const key = `${entity.x},${entity.y}`;
            const count = occupiedTiles.get(key);
            if (count === 1) occupiedTiles.delete(key);
            else if (count > 1) occupiedTiles.set(key, count - 1);
        };

        [...entities, ...this.items.filter(item => item.alive)].forEach(addOccupant);
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        entities.forEach(entity => {
            if (Math.random() >= 0.5) return;

            removeOccupant(entity);
            const destination = Utils.shuffle(directions).map(({ dx, dy }) => ({
                x: entity.x + dx,
                y: entity.y + dy
            })).find(tile =>
                Utils.inBounds(tile, this.width, this.height) &&
                !this.isBlockedTile(tile.x, tile.y) &&
                !(tile.x === this.player.x && tile.y === this.player.y) &&
                !occupiedTiles.has(`${tile.x},${tile.y}`)
            );

            if (destination) {
                entity.x = destination.x;
                entity.y = destination.y;
            }
            addOccupant(entity);
        });
    },

    getBlockedTerrainMessage(x, y) {
        const terrain = this.map[y]?.[x]?.type;
        if (terrain === 'river' || terrain === 'lake') {
            return 'The water is too deep to cross here. Find a bridge or another route!';
        }
        return terrain === 'house'
            ? 'A building blocks your way!'
            : 'The mountains block your way. Find a pass!';
    },

    // Helper: Get direction text for movement feedback

    getDirectionText(direction) {
        const directions = [
            {dx: 0, dy: -1}, // up
            {dx: 0, dy: 1},  // down
            {dx: -1, dy: 0}, // left
            {dx: 1, dy: 0}   // right
        ];
        const dir = directions.find(d => d.dx === direction.dx && d.dy === direction.dy);
        return dir ? (dir.dy < 0 ? 'North' : dir.dy > 0 ? 'South' : dir.dx < 0 ? 'West' : 'East') : 'random';
    },

    // Render movement effect when player moves

    renderMovementEffect(x, y) {
        const screenX = (x - this.cameraX) * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = (y - this.cameraY) * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        // Draw a trail effect - brighter and more visible
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, this.TILE_SIZE * 0.45, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'; // Purple trail for player
        this.ctx.fill();
    },

    // Update static HUD health bars
});
