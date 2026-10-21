/**
 * Camera - Handles viewport and camera tracking
 */

const Camera = {
    /**
     * Follow player to a new position
     */
    followPlayer(game) {
        if (!game || !game.player) return;
        
        const centerX = Math.floor(game.width / 2);
        const centerY = Math.floor(game.height / 2);
        
        // Center camera on player, keep within bounds
        let targetX = game.player.x;
        let targetY = game.player.y;
        
        // Keep centered when close to edge of viewport
        if (game.viewWidth > 0) {
            const halfView = Math.floor(game.viewWidth / 2);
            
            if (targetX < centerX - halfView) {
                targetX = centerX - halfView;
            } else if (targetX > centerX + halfView) {
                targetX = centerX + halfView;
            }
        }
        
        if (game.viewHeight > 0) {
            const halfView = Math.floor(game.viewHeight / 2);
            
            if (targetY < centerY - halfView) {
                targetY = centerY - halfView;
            } else if (targetY > centerY + halfView) {
                targetY = centerY + halfView;
            }
        }
        
        return { x: targetX, y: targetY };
    },

    /**
     * Pan camera to a specific position
     */
    panTo(x, y) {
        if (!x || x < 0) x = 0;
        if (!y || y < 0) y = 0;
        
        return { x, y };
    },

    /**
     * Get visible area for rendering
     */
    getVisibleArea(width, height, cameraX, cameraY) {
        const startX = Math.max(0, Math.floor(cameraX));
        const startY = Math.max(0, Math.floor(cameraY));
        
        return {
            x: startX,
            y: startY,
            width: Math.min(width - startX, width),
            height: Math.min(height - startY, height)
        };
    }
};

export default Camera;
