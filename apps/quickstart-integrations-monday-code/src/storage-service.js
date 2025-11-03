import { Logger, Storage } from "@mondaycom/apps-sdk";

const logTag = "StorageService";
const logger = new Logger(logTag);

const CACHE_TTL = 86400; // 24 hours in seconds

/**
 * Stores movie data in monday.com Storage
 * @param {string} token - The access token for monday API
 * @param {string} movieTitle - The movie title to use as key
 * @param {object} movieData - The movie data to cache
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const cacheMovieData = async (token, movieTitle, movieData) => {
  try {
    if (!token || !movieTitle || !movieData) {
      logger.warn("Missing required parameters for caching movie data");
      return false;
    }

    const storage = new Storage(token);
    const cacheKey = `movie_${movieTitle.toLowerCase().replace(/\s+/g, "_")}`;
    const cachePayload = {
      data: movieData,
      cachedAt: new Date().toISOString(),
      movieTitle: movieTitle, // Store original title for reference
    };
    const cacheValue = JSON.stringify(cachePayload);

    logger.info({ cacheKey, valueLength: cacheValue.length, movieTitle }, "Caching movie data");
    const result = await storage.set(cacheKey, cacheValue, { ttl: CACHE_TTL });
    logger.info({ result }, "Storage.set result");
    logger.info({ movieTitle, cacheKey, ttl: CACHE_TTL }, "Successfully cached movie data");
    return true;
  } catch (err) {
    logger.error({
      movieTitle,
      error: err.message,
      stack: err.stack,
      name: err.name
    }, "Error caching movie data");
    return false;
  }
};

/**
 * Retrieves cached movie data from monday.com Storage
 * @param {string} token - The access token for monday API
 * @param {string} movieTitle - The movie title to use as key
 * @returns {Promise<object|null>} - Returns the cached movie data or null if not found
 */
export const getCachedMovieData = async (token, movieTitle) => {
  try {
    if (!token || !movieTitle) {
      logger.warn("Missing required parameters for retrieving cached movie data");
      return null;
    }

    const storage = new Storage(token);
    const cacheKey = `movie_${movieTitle.toLowerCase().replace(/\s+/g, "_")}`;
    
    logger.info({ cacheKey, movieTitle }, "Attempting to retrieve cache");
    const cachedValue = await storage.get(cacheKey);
    
    if (!cachedValue || cachedValue === null || cachedValue === undefined) {
      logger.info({ movieTitle, cacheKey }, "No cached data found");
      return null;
    }

    logger.info({ valueType: typeof cachedValue }, "Raw cached value type");
    
    // Storage API returns an object with {success: boolean, value: string}
    let valueString;
    if (typeof cachedValue === 'object' && cachedValue.value) {
      // Extract the value from the response object
      valueString = cachedValue.value;
    } else if (typeof cachedValue === 'string') {
      valueString = cachedValue;
    } else {
      logger.warn({ cacheKey, valueType: typeof cachedValue }, "Unexpected cache value structure");
      return null;
    }

    // Check if value is empty
    if (!valueString) {
      logger.info({ movieTitle, cacheKey }, "No cached data found (empty value)");
      return null;
    }
    
    // Parse the JSON string
    const parsedCache = JSON.parse(valueString);
    logger.info({ movieTitle, cachedAt: parsedCache.cachedAt }, "Retrieved cached data");
    return parsedCache.data;
  } catch (err) {
    logger.error({
      movieTitle,
      error: err.message,
      stack: err.stack,
      name: err.name
    }, "Error retrieving cached movie data");
    return null;
  }
};

/**
 * Stores a generic key-value pair in monday.com Storage
 * @param {string} token - The access token for monday API
 * @param {string} key - The storage key
 * @param {any} value - The value to store (will be JSON stringified)
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const setStorageValue = async (token, key, value, ttl = null) => {
  try {
    if (!token || !key) {
      logger.warn("Missing required parameters for setting storage value");
      return false;
    }

    const storage = new Storage(token);
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    const options = ttl ? { ttl } : {};

    await storage.set(key, stringValue, options);
    logger.info(`Successfully stored value for key: "${key}"`);
    return true;
  } catch (err) {
    logger.error(`Error storing value for key "${key}":`, err);
    return false;
  }
};

/**
 * Retrieves a value from monday.com Storage
 * @param {string} token - The access token for monday API
 * @param {string} key - The storage key
 * @param {boolean} parseJson - Whether to parse the value as JSON (default: true)
 * @returns {Promise<any|null>} - Returns the stored value or null if not found
 */
export const getStorageValue = async (token, key, parseJson = true) => {
  try {
    if (!token || !key) {
      logger.warn("Missing required parameters for getting storage value");
      return null;
    }

    const storage = new Storage(token);
    const value = await storage.get(key);
    
    if (!value) {
      logger.info(`No value found for key: "${key}"`);
      return null;
    }

    if (parseJson) {
      try {
        return JSON.parse(value);
      } catch (parseErr) {
        // If parsing fails, return the raw value
        logger.warn(`Failed to parse JSON for key "${key}", returning raw value`);
        return value;
      }
    }

    return value;
  } catch (err) {
    logger.error(`Error retrieving value for key "${key}":`, err);
    return null;
  }
};

