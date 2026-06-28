import { Logger, Storage } from "@mondaycom/apps-sdk";
import type { MovieData } from "./omdb-api.service.js";

const logger = new Logger("StorageService");

const CACHE_TTL = 86400;

export const cacheMovieData = async (token: string, movieTitle: string, movieData: MovieData): Promise<boolean> => {
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
      movieTitle,
    };
    const cacheValue = JSON.stringify(cachePayload);

    logger.info(`Caching movie data: key=${cacheKey}, length=${cacheValue.length}, title=${movieTitle}`);
    await storage.set(cacheKey, cacheValue, { ttl: CACHE_TTL });
    logger.info(`Successfully cached movie data for ${movieTitle} with TTL ${CACHE_TTL}`);
    return true;
  } catch (err) {
    logger.error(`Error caching movie data for ${movieTitle}: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    return false;
  }
};

export const getCachedMovieData = async (token: string, movieTitle: string): Promise<MovieData | null> => {
  try {
    if (!token || !movieTitle) {
      logger.warn("Missing required parameters for retrieving cached movie data");
      return null;
    }

    const storage = new Storage(token);
    const cacheKey = `movie_${movieTitle.toLowerCase().replace(/\s+/g, "_")}`;

    logger.info(`Attempting to retrieve cache: key=${cacheKey}, title=${movieTitle}`);
    const cachedResult = await storage.get(cacheKey);

    if (!cachedResult || !cachedResult.value) {
      return null;
    }

    const valueString = typeof cachedResult.value === "string" ? cachedResult.value : null;
    if (!valueString) return null;

    const parsedCache = JSON.parse(valueString) as { data: MovieData; cachedAt: string };
    logger.info(`Retrieved cached data for ${movieTitle}, cachedAt: ${parsedCache.cachedAt}`);
    return parsedCache.data;
  } catch (err) {
    logger.error(`Error retrieving cached movie data for ${movieTitle}: ${(err as Error).message}`);
    return null;
  }
};

export const setStorageValue = async (token: string, key: string, value: unknown, ttl: number | null = null): Promise<boolean> => {
  try {
    if (!token || !key) return false;

    const storage = new Storage(token);
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    const options = ttl ? { ttl } : {};

    await storage.set(key, stringValue, options);
    return true;
  } catch (err) {
    logger.error(`Error storing value for key "${key}": ${(err as Error).message}`);
    return false;
  }
};

export const getStorageValue = async (token: string, key: string, parseJson = true): Promise<unknown> => {
  try {
    if (!token || !key) return null;

    const storage = new Storage(token);
    const result = await storage.get(key);

    if (!result || !result.value) return null;

    const value = result.value;

    if (parseJson && typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  } catch (err) {
    logger.error(`Error retrieving value for key "${key}": ${(err as Error).message}`);
    return null;
  }
};
