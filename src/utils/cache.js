export const CACHE_KEY = 'ceylon_spice_products_data';
export const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour in milliseconds

/**
 * Retrieves cached data if it exists and hasn't expired.
 * @returns {Array|null} The cached product array or null.
 */
export const getCachedData = () => {
    try {
        const json = localStorage.getItem(CACHE_KEY);
        if (!json) return null;

        const { data, timestamp } = JSON.parse(json);
        const now = Date.now();

        // Check if expired
        if (now - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error reading from cache", error);
        return null;
    }
};

/**
 * Saves data to cache with a timestamp.
 * @param {Array} data The data to cache
 */
export const setCachedData = (data) => {
    try {
        const cacheObject = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
        console.error("Error saving to cache", error);
    }
};

/**
 * Clears the cache explicitly (e.g. for forced refresh or logout)
 */
export const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
};
