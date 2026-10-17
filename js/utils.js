// Utility Functions for RPG Game
const Utils = {
    // Random number between min and max (inclusive)
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Shuffle array using Fisher-Yates algorithm
    shuffle: (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Utils.random(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Deep clone object
    clone: (obj) => JSON.parse(JSON.stringify(obj)),

    // Format number with thousands separator
    formatNumber: (num) => num.toLocaleString(),

    // Wait/promise delay
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Show message in footer
    showMessage: (message, type = 'info') => {
        const footer = document.getElementById('message-area');
        footer.textContent = message;
        footer.className = `message-${type}`;
        Utils.wait(3000).then(() => {
            footer.textContent = '';
        });
    },

    // Check if object has property
    has: (obj, prop) => obj && Object.prototype.hasOwnProperty.call(obj, prop),

    // Get or set local storage
    getLocalStorage: (key, defaultValue) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },

    setLocalStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },

    // Create tile coordinates
    createTile: (x, y) => ({ x, y }),

    // Distance between two points
    distance: (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)),

    // Check if point is in bounds
    inBounds: (point, width, height) => 
        point.x >= 0 && point.x < width && point.y >= 0 && point.y < height,

    // Simple collision detection between circles
    circleCollision: (c1, c2, radius) => Utils.distance(c1, c2) <= radius * 2,

    // Generate unique ID
    generateId: () => '_' + Math.random().toString(36).substr(2, 9),

    // Clamp value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max)
};
