/**
 * Utils - Helper functions shared across the game
 */

const Utils = {
    /**
     * Get a random number within range
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} Random number
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Check if coordinates are within bounds
     * @param {object} obj - Object with x and y properties
     * @param {number} width - Maximum X value
     * @param {number} height - Maximum Y value
     * @returns {boolean} True if in bounds
     */
    inBounds(obj, width, height) {
        return obj.x >= 0 && obj.x < width && obj.y >= 0 && obj.y < height;
    },

    /**
     * Set/get localStorage items
     * @param {string} key - Storage key
     * @param {*} value - Value to save (optional)
     */
    setLocalStorage(key, value) {
        if (arguments.length === 1) {
            return localStorage.getItem(key);
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`[Utils] Failed to save to localStorage:`, e);
            return false;
        }
    },

    /**
     * Get saved item from localStorage
     * @param {string} key - Storage key
     * @returns {*} Saved value or null
     */
    getSavedLocalStorage(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        try {
            return JSON.parse(data);
        } catch (e) {
            console.warn(`[Utils] Failed to parse localStorage item:`, e);
            return null;
        }
    },

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Wait for specified duration in milliseconds
     * @param {number} ms - Duration to wait
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Create a shallow copy of an object
     * @param {object} obj - Object to clone
     * @returns {object} New object with copied properties
     */
    shallowClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        return Object.assign({}, obj);
    },

    /**
     * Check if object is empty
     * @param {object} obj - Object to check
     * @returns {boolean} True if empty or null/undefined
     */
    isEmpty(obj) {
        if (!obj || obj === null || obj === undefined) return true;
        
        if (Array.isArray(obj)) return obj.length === 0;
        return Object.keys(obj).length === 0;
    },

    /**
     * Merge two objects with last one taking precedence
     * @param {object} target - Target object (modified in place)
     * @param {object} source - Source object (overwrites)
     * @returns {object} Modified target object
     */
    merge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    },

    /**
     * Debounce function calls
     * @param {function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Create a bounding box from two points
     * @param {object} p1 - First point with x and y
     * @param {object} p2 - Second point with x and y
     * @returns {object} Bounding box with min/max x/y
     */
    createBoundingBox(p1, p2) {
        return {
            minX: Math.min(p1.x, p2.x),
            minY: Math.min(p1.y, p2.y),
            maxX: Math.max(p1.x, p2.x),
            maxY: Math.max(p1.y, p2.y)
        };
    },

    /**
     * Calculate distance between two points
     * @param {object} p1 - First point with x and y
     * @param {object} p2 - Second point with x and y
     * @returns {number} Distance (approximate for tile map)
     */
    calculateDistance(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); // Manhattan distance
    },

    /**
     * Normalize a value between 0-1
     * @param {number} value - Value to normalize
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} Normalized value between 0 and 1
     */
    normalize(value, min, max) {
        const range = max - min;
        return Math.max(0, Math.min(1, (value - min) / range));
    }
};

export default Utils;
