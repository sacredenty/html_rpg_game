// Rendering game behavior with optimized UI updates
Object.assign(Game, {
    // Track last health bar update time for throttling
    lastHealthUpdate: 0,

    render() {
        // Throttle HUD health bar updates to prevent excessive DOM manipulation
        const now = Date.now();
        if (now - this.lastHealthUpdate > 100) { // Update at most every 100ms
            this.updateHUDHealthBars();
            this.lastHealthUpdate = now;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.cameraX * this.TILE_SIZE, -this.cameraY * this.TILE_SIZE);
        SpriteRenderer.drawTerrain(this);
        this.drawGrid();

        this.items.filter(item => item.alive && this.isInViewport(item)).forEach(item => {
            SpriteRenderer.drawItem(this, item);
        });

        this.npcs.filter(npc => npc.alive && this.isInViewport(npc)).forEach(npc => {
            SpriteRenderer.drawNPC(this, npc);
        });
        
        this.monsters.filter(monster => monster.alive && this.isInViewport(monster)).forEach(monster => {
            SpriteRenderer.drawMonster(this, monster);
        });
        // Fixed: Removed duplicate hero rendering call
        SpriteRenderer.drawHero(this);
        this.ctx.restore();
    },

    isInViewport(entity) {
        return entity.x >= this.cameraX && entity.x < this.cameraX + this.viewWidth &&
            entity.y >= this.cameraY && entity.y < this.cameraY + this.viewHeight;
    },

    drawTerrain() {
        for (let screenY = 0; screenY < this.viewHeight; screenY++) {
            for (let screenX = 0; screenX < this.viewWidth; screenX++) {
                const worldX = this.cameraX + screenX;
                const worldY = this.cameraY + screenY;
                const type = this.map[worldY]?.[worldX]?.type;
                const left = worldX * this.TILE_SIZE;
                const top = worldY * this.TILE_SIZE;

                if (type === 'river' || type === 'lake') {
                    this.ctx.fillStyle = '#0284c7';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 8, top + 14);
                    this.ctx.quadraticCurveTo(left + 20, top + 8, left + 32, top + 14);
                    this.ctx.moveTo(left + 5, top + 29);
                    this.ctx.quadraticCurveTo(left + 18, top + 23, left + 30, top + 29);
                    this.ctx.stroke();
                } else if (type === 'bridge') {
                    this.ctx.fillStyle = '#92400e';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.strokeStyle = '#fcd34d';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 3, top + 12);
                    this.ctx.lineTo(left + this.TILE_SIZE - 3, top + 12);
                    this.ctx.moveTo(left + 3, top + 28);
                    this.ctx.lineTo(left + this.TILE_SIZE - 3, top + 28);
                    this.ctx.stroke();
                } else if (type === 'mountain') {
                    this.ctx.fillStyle = '#6b7280';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    this.ctx.font = `${this.TILE_SIZE * 0.8}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('⛰️', left + this.TILE_SIZE / 2, top + this.TILE_SIZE / 2);
                } else if (type === 'town' || type === 'road') {
                    this.ctx.fillStyle = type === 'road' ? '#a16207' : '#4b7351';
                    this.ctx.fillRect(left, top, this.TILE_SIZE, this.TILE_SIZE);
                    if (type === 'road') {
                        this.ctx.fillStyle = 'rgba(253, 230, 138, 0.45)';
                        this.ctx.fillRect(left + 4, top + 4, this.TILE_SIZE - 8, this.TILE_SIZE - 8);
                    }
                } else if (type === 'house') {
                    this.ctx.fillStyle = '#78350f';
                    this.ctx.fillRect(left + 5, top + 13, this.TILE_SIZE - 10, this.TILE_SIZE - 15);
                    this.ctx.fillStyle = '#b91c1c';
                    this.ctx.beginPath();
                    this.ctx.moveTo(left + 2, top + 15);
                    this.ctx.lineTo(left + this.TILE_SIZE / 2, top + 2);
                    this.ctx.lineTo(left + this.TILE_SIZE - 2, top + 15);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
    },

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(24, 31, 45, 0.14)';
        this.ctx.lineWidth = 1;
        
        for (let x = this.cameraX; x <= this.cameraX + this.viewWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.TILE_SIZE, 0);
            this.ctx.lineTo(x * this.TILE_SIZE, (this.cameraY + this.viewHeight) * this.TILE_SIZE);
            this.ctx.stroke();
        }
        
        for (let y = this.cameraY; y <= this.cameraY + this.viewHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.TILE_SIZE);
            this.ctx.lineTo((this.cameraX + this.viewWidth) * this.TILE_SIZE, y * this.TILE_SIZE);
            this.ctx.stroke();
        }
    },

    drawEntity(x, y, symbol, color, size) {
        const screenX = x * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = y * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        // Draw colored circle background
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, this.TILE_SIZE * size * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.stroke();
        
        // Draw symbol
        this.ctx.font = `bold ${this.TILE_SIZE * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(symbol, screenX, screenY);
    },

    drawSpriteShadow(x, y) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(x, y + 12, 12, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
        ctx.fill();
    },

    drawFace(x, y, skin = '#f1c8a5', eyeColor = '#172033') {
        const ctx = this.ctx;
        ctx.fillStyle = skin;
        ctx.strokeStyle = '#422b2b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, 6.5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(x - 2.5, y, 0.9, 0, Math.PI * 2);
        ctx.arc(x + 2.5, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
    },

    drawHeroSprite() {
        const ctx = this.ctx;
        const x = (this.player.x + 0.5) * this.TILE_SIZE;
        const y = (this.player.y + 0.5) * this.TILE_SIZE;
        const scale = this.TILE_SIZE / 40;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        this.drawSpriteShadow(0, 0);

        ctx.beginPath();
        ctx.ellipse(0, 0, 17, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#7f1d1d';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(8, -8);
        ctx.lineTo(12, 3);
        ctx.lineTo(8, 15);
        ctx.lineTo(0, 12);
        ctx.lineTo(-8, 15);
        ctx.lineTo(-12, 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(-8, -9);
        ctx.lineTo(8, -9);
        ctx.lineTo(10, 2);
        ctx.lineTo(7, 10);
        ctx.lineTo(0, 13);
        ctx.lineTo(-7, 10);
        ctx.lineTo(-10, 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#172554';
        ctx.stroke();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, -5);
        ctx.lineTo(-5, 7);
        ctx.moveTo(7, -5);
        ctx.lineTo(5, 7);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-7, 0, 14, 2);

        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(-10, -3, 3.5, 5, -0.25, 0, Math.PI * 2);
        ctx.ellipse(10, -3, 3.5, 5, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        this.drawFace(0, -10, '#f1c8a5');
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-7, -13);
        ctx.lineTo(-7, -17);
        ctx.lineTo(-4, -20);
        ctx.lineTo(4, -20);
        ctx.lineTo(7, -17);
        ctx.lineTo(7, -13);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-7, -14, 14, 2);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(3, -17);
        ctx.lineTo(0, -15);
        ctx.lineTo(-3, -17);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.translate(13, 1);
        ctx.rotate(0.35);
        ctx.shadowColor = 'rgba(125, 211, 252, 0.95)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#e0f2fe';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -17);
        ctx.lineTo(2, -17);
        ctx.lineTo(1.5, 1);
        ctx.lineTo(0, 4);
        ctx.lineTo(-1.5, 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-5, 3, 10, 2);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-1, 5, 2, 6);
        ctx.restore();
        ctx.restore();
    },

    drawMonsterSprite(monster) {
        const ctx = this.ctx;
        const x = (monster.x + 0.5) * this.TILE_SIZE;
        const y = (monster.y + 0.5) * this.TILE_SIZE;
        const scale = (this.TILE_SIZE / 40) * Math.min(monster.size || 1, 1.2);

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        this.drawSpriteShadow(0, 0);

        if (monster.type === 'slime') {
            ctx.fillStyle = '#22c55e';
            ctx.strokeStyle = '#14532d';
            ctx.beginPath();
            ctx.moveTo(-13, 7);
            ctx.quadraticCurveTo(-16, 1, -10, -5);
            ctx.quadraticCurveTo(0, -14, 10, -5);
            ctx.quadraticCurveTo(16, 1, 13, 7);
            ctx.quadraticCurveTo(0, 12, -13, 7);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'rgba(220, 252, 231, 0.8)';
            ctx.beginPath();
            ctx.ellipse(-5, -5, 3, 1.5, -0.5, 0, Math.PI * 2);
            ctx.fill();
            this.drawFace(0, 1, '#dcfce7');
        } else if (monster.type === 'wolf') {
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.ellipse(-1, 2, 13, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-9, -3);
            ctx.lineTo(-11, -13);
            ctx.lineTo(-3, -7);
            ctx.lineTo(4, -8);
            ctx.lineTo(11, -13);
            ctx.lineTo(10, -3);
            ctx.lineTo(15, 2);
            ctx.lineTo(8, 7);
            ctx.lineTo(-8, 7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath();
            ctx.moveTo(-9, -7);
            ctx.lineTo(-10, -11);
            ctx.lineTo(-6, -8);
            ctx.moveTo(7, -8);
            ctx.lineTo(10, -11);
            ctx.lineTo(9, -6);
            ctx.fill();
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.moveTo(8, 1);
            ctx.lineTo(16, 3);
            ctx.lineTo(8, 5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.arc(7, -3, 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else if (monster.type === 'skeleton') {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-6, 2);
            ctx.lineTo(-7, 10);
            ctx.moveTo(6, 2);
            ctx.lineTo(7, 10);
            ctx.moveTo(-7, 4);
            ctx.lineTo(7, 4);
            ctx.stroke();
            ctx.fillStyle = '#e2e8f0';
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.ellipse(0, -7, 9, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(-3, -8, 2, 0, Math.PI * 2);
            ctx.arc(3, -8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-4, -1);
            ctx.lineTo(4, -1);
            ctx.stroke();
        } else if (monster.type === 'dragon') {
            ctx.fillStyle = '#9333ea';
            ctx.strokeStyle = '#3b0764';
            ctx.beginPath();
            ctx.moveTo(-7, 1);
            ctx.lineTo(-19, -11);
            ctx.lineTo(-14, 4);
            ctx.lineTo(-7, 8);
            ctx.lineTo(7, 8);
            ctx.lineTo(14, 4);
            ctx.lineTo(19, -11);
            ctx.lineTo(7, 1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 3, 9, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -8, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(-3, -9, 1.2, 0, Math.PI * 2);
            ctx.arc(3, -9, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fef3c7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-4, 11);
            ctx.lineTo(0, 16);
            ctx.lineTo(4, 11);
            ctx.stroke();
        } else {
            const isOrc = monster.type === 'orc';
            const skin = isOrc ? '#b91c1c' : '#65a30d';
            ctx.fillStyle = skin;
            ctx.strokeStyle = isOrc ? '#450a0a' : '#365314';
            ctx.beginPath();
            ctx.moveTo(-8, -10);
            ctx.lineTo(-15, -15);
            ctx.lineTo(-13, -5);
            ctx.lineTo(-11, 7);
            ctx.lineTo(-7, 11);
            ctx.lineTo(7, 11);
            ctx.lineTo(11, 7);
            ctx.lineTo(13, -5);
            ctx.lineTo(15, -15);
            ctx.lineTo(8, -10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(-9, 2, 18, 7);
            ctx.strokeRect(-9, 2, 18, 7);
            this.drawFace(0, -6, skin, '#1f2937');
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(-5, -2);
            ctx.lineTo(-2, 1);
            ctx.lineTo(-7, 1);
            ctx.moveTo(5, -2);
            ctx.lineTo(2, 1);
            ctx.lineTo(7, 1);
            ctx.fill();
        }
        ctx.restore();
    },

    drawNpcSprite(npc) {
        const ctx = this.ctx;
        const x = (npc.x + 0.5) * this.TILE_SIZE;
        const y = (npc.y + 0.5) * this.TILE_SIZE;
        const isKing = npc.type === 'king';
        const isMerchant = npc.type === 'merchant';
        const coat = isKing ? '#2563eb' : isMerchant ? '#059669' : '#b45309';

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(this.TILE_SIZE / 40, this.TILE_SIZE / 40);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#422b2b';
        this.drawSpriteShadow(0, 0);

        ctx.fillStyle = coat;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-7, -7);
        ctx.lineTo(7, -7);
        ctx.lineTo(10, 0);
        ctx.lineTo(8, 10);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.drawFace(0, -10, '#e7bd91');

        if (isKing) {
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#78350f';
            ctx.beginPath();
            ctx.moveTo(-8, -16);
            ctx.lineTo(-7, -23);
            ctx.lineTo(-2, -19);
            ctx.lineTo(0, -25);
            ctx.lineTo(3, -19);
            ctx.lineTo(8, -23);
            ctx.lineTo(8, -16);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (isMerchant) {
            ctx.fillStyle = '#92400e';
            ctx.beginPath();
            ctx.moveTo(-12, -14);
            ctx.lineTo(0, -23);
            ctx.lineTo(12, -14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillRect(-9, -14, 18, 3);
            ctx.strokeRect(-9, -14, 18, 3);
        } else {
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.ellipse(0, -15, 8, 4, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-8, -15, 16, 3);
        }
        ctx.restore();
    },

    drawHealthBar(x, y, current, max) {
        const screenX = x * this.TILE_SIZE + 5;
        const screenY = (y + 3) * this.TILE_SIZE + 5;
        const barWidth = this.TILE_SIZE - 10;
        const barHeight = 8;
        const healthPercent = current / max;
        
        // Background
        this.ctx.fillStyle = '#1f2937';
        this.ctx.fillRect(screenX, screenY, barWidth, barHeight);
        
        // Health - more vibrant colors for player
        this.ctx.fillStyle = healthPercent > 0.6 ? '#22c55e' : 
                             healthPercent > 0.3 ? '#fbbf24' : '#ef4444';
        this.ctx.fillRect(screenX, screenY, barWidth * healthPercent, barHeight);
    },

    // Draw monster health bar (above the monster)

    drawMonsterHealthBar(x, y, current, max) {
        const screenX = x * this.TILE_SIZE + 5;
        const screenY = (y - 1) * this.TILE_SIZE + 2; // Above the monster
        const barWidth = this.TILE_SIZE - 8;
        const barHeight = 6;
        const healthPercent = current / max;
        
        // Background
        this.ctx.fillStyle = '#374151';
        this.ctx.fillRect(screenX, screenY, barWidth, barHeight);
        
        // Health color based on percentage
        this.ctx.fillStyle = healthPercent > 0.6 ? '#22c55e' : 
                             healthPercent > 0.3 ? '#eab308' : '#ef4444';
        this.ctx.fillRect(screenX, screenY, barWidth * healthPercent, barHeight);
    },

    renderCombatFeedback(x, y, text, color) {
        const screenX = (x - this.cameraX) * this.TILE_SIZE + this.TILE_SIZE / 2;
        const screenY = (y - this.cameraY - 1) * this.TILE_SIZE + this.TILE_SIZE / 2;
        
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, screenX, screenY);
    },

    // Setup event listeners for buttons
});
