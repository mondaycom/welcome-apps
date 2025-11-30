// --- OMDb Integration Service ---
// Orchestrates movie data fetching, caching, and monday.com board updates

import { Logger } from "@mondaycom/apps-sdk";
import { changeColumnValue, getBoardColumns } from "./monday-api-service.js";
import { extractMovieInfo, fetchMovieData } from "./omdb-api.js";
import { cacheMovieData, getCachedMovieData } from "./storage-service.js";

const logger = new Logger("OmdbService");

// Storage propagation delay (monday.com Storage API requirement)
const STORAGE_PROPAGATION_DELAY_MS = 1000;

/**
 * Result object returned by movie data operations
 * @typedef {Object} MovieDataResult
 * @property {object|null} movieData - Raw movie data from API/cache
 * @property {object|null} movieInfo - Formatted movie information
 * @property {boolean} fromCache - Whether data was retrieved from cache
 */

/**
 * Result object returned by board update operations
 * @typedef {Object} BoardUpdateResult
 * @property {boolean} success - Whether the update was successful
 * @property {object|null} column - Updated column info (id, title, type)
 * @property {string|null} error - Error message if update failed
 */

/**
 * Result object returned by the webhook processor
 * @typedef {Object} WebhookProcessResult
 * @property {boolean} success - Whether processing was successful
 * @property {string} message - Status message
 * @property {object|null} movieInfo - Formatted movie information
 * @property {boolean} fromCache - Whether movie data was from cache
 * @property {object|null} updatedColumn - Updated column info
 * @property {string|null} error - Error message if processing failed
 */

// ============================================================================
// Movie Data Operations
// ============================================================================

/**
 * Fetches movie data with cache-first strategy.
 * Attempts to retrieve from cache first, falls back to OMDb API if not cached.
 * Automatically caches fresh data for future requests.
 *
 * @param {string} token - monday.com access token
 * @param {string} movieTitle - Title of the movie to lookup
 * @returns {Promise<MovieDataResult>} Movie data result object
 */
async function getMovieDataWithCache(token, movieTitle) {
  let movieData = null;
  let fromCache = false;

  // Step 1: Try to get cached data
  try {
    movieData = await getCachedMovieData(token, movieTitle);
    if (movieData) {
      fromCache = true;
      logger.info({ movieTitle }, "Using cached movie data");
      console.log(`📦 Retrieved movie data from cache for: "${movieTitle}"`);
    }
  } catch (cacheErr) {
    logger.warn(
      { movieTitle, error: cacheErr.message },
      "Cache retrieval failed, will fetch fresh data"
    );
  }

  // Step 2: Fetch from API if not in cache
  if (!movieData) {
    movieData = await fetchMovieData(movieTitle);

    if (!movieData) {
      logger.warn({ movieTitle }, "No movie data found from OMDb API");
      return { movieData: null, movieInfo: null, fromCache: false };
    }

    // Step 3: Cache the fresh data for future requests
    await cacheMovieDataSafely(token, movieTitle, movieData);
  }

  // Extract formatted movie info
  const movieInfo = extractMovieInfo(movieData);

  return { movieData, movieInfo, fromCache };
}

/**
 * Safely caches movie data, handling errors gracefully.
 * Waits for storage propagation after successful caching.
 *
 * @param {string} token - monday.com access token
 * @param {string} movieTitle - Title of the movie (used as cache key)
 * @param {object} movieData - Raw movie data to cache
 * @returns {Promise<boolean>} Whether caching was successful
 */
async function cacheMovieDataSafely(token, movieTitle, movieData) {
  try {
    const cached = await cacheMovieData(token, movieTitle, movieData);
    if (cached) {
      console.log(`💾 Cached movie data for: "${movieTitle}"`);
      // Wait for storage propagation
      await new Promise((resolve) =>
        setTimeout(resolve, STORAGE_PROPAGATION_DELAY_MS)
      );
      return true;
    }
    return false;
  } catch (cacheErr) {
    logger.warn(
      { movieTitle, error: cacheErr.message },
      "Failed to cache movie data"
    );
    return false;
  }
}

/**
 * Logs formatted movie information to console.
 *
 * @param {object} movieInfo - Formatted movie information
 * @param {boolean} fromCache - Whether data was from cache
 */
function logMovieInfo(movieInfo, fromCache) {
  console.log("\n=== Movie Information ===");
  console.log(`Source: ${fromCache ? "Cache" : "OMDb API"}`);
  console.log(`Title: ${movieInfo.title}`);
  console.log(`Year: ${movieInfo.year}`);
  console.log(`IMDb Rating: ${movieInfo.imdbRating}/10`);
  console.log(`Genre: ${movieInfo.genre}`);
  console.log(`Director: ${movieInfo.director}`);
  console.log(`Actors: ${movieInfo.actors}`);
  console.log(`Plot: ${movieInfo.plot}`);
  console.log("========================\n");
}

// ============================================================================
// Board Update Operations
// ============================================================================

/**
 * Finds a suitable text column on the board for storing movie data.
 * Looks for columns of type "text" or "long_text".
 *
 * @param {string} token - monday.com access token
 * @param {string|number} boardId - ID of the board to search
 * @returns {Promise<object|null>} Column object {id, title, type} or null if not found
 */
async function findTextColumn(token, boardId) {
  const columns = await getBoardColumns(token, boardId);
  logger.info(
    { boardId, columnCount: columns.length },
    "Found columns on board"
  );

  const textColumn = columns.find(
    (col) => col.type === "text" || col.type === "long_text"
  );

  if (textColumn) {
    logger.info(
      {
        columnType: textColumn.type,
        columnTitle: textColumn.title,
        columnId: textColumn.id,
      },
      "Found text column"
    );
  }

  return textColumn || null;
}

/**
 * Updates a monday.com board item with movie plot information.
 * Automatically finds the first text/long_text column to update.
 *
 * @param {string} token - monday.com access token
 * @param {string|number} boardId - ID of the board
 * @param {string|number} pulseId - ID of the item (pulse) to update
 * @param {object} movieInfo - Formatted movie information
 * @returns {Promise<BoardUpdateResult>} Result of the board update operation
 */
async function updateBoardWithMoviePlot(token, boardId, pulseId, movieInfo) {
  // Find a suitable text column
  const textColumn = await findTextColumn(token, boardId);

  if (!textColumn) {
    logger.warn({ boardId }, "No text or long_text column found on the board");
    return {
      success: false,
      column: null,
      error: "No text column found on board",
    };
  }

  // Update the column with the movie plot
  const columnValue = JSON.stringify(movieInfo.plot);
  await changeColumnValue(token, boardId, pulseId, textColumn.id, columnValue);

  logger.info(
    { columnId: textColumn.id, boardId, pulseId },
    "Successfully updated column with movie plot"
  );
  console.log(`✅ Updated "${textColumn.title}" column with movie plot`);

  return {
    success: true,
    column: {
      id: textColumn.id,
      title: textColumn.title,
      type: textColumn.type,
    },
    error: null,
  };
}

// ============================================================================
// Main Webhook Processing
// ============================================================================

/**
 * Processes a webhook event for movie lookup and board update.
 * This is the main orchestration function that:
 * 1. Fetches movie data (with caching)
 * 2. Updates the board with movie information
 *
 * @param {string} token - monday.com access token
 * @param {object} event - Webhook event object containing boardId, pulseId, pulseName
 * @returns {Promise<WebhookProcessResult>} Complete result of webhook processing
 */
export async function processMovieLookup(token, event) {
  const { boardId, pulseId, pulseName: movieTitle } = event;

  logger.info({ movieTitle, boardId, pulseId }, "Processing movie lookup");

  // Step 1: Get movie data (from cache or API)
  const { movieInfo, fromCache } = await getMovieDataWithCache(
    token,
    movieTitle
  );

  if (!movieInfo) {
    return {
      success: false,
      message: "Movie not found",
      movieInfo: null,
      fromCache: false,
      updatedColumn: null,
      searchedTitle: movieTitle,
    };
  }

  // Log movie info to console
  logger.info({ movieInfo, fromCache }, "Movie data retrieved");
  logMovieInfo(movieInfo, fromCache);

  // Step 2: Update the board with movie plot
  const updateResult = await updateBoardWithMoviePlot(
    token,
    boardId,
    pulseId,
    movieInfo
  );

  if (!updateResult.success) {
    return {
      success: true, // Movie was found, just couldn't update board
      message: "Movie data retrieved but no text column found on board",
      movieInfo,
      fromCache,
      updatedColumn: null,
      error: updateResult.error,
    };
  }

  return {
    success: true,
    message: "Movie data retrieved and board updated successfully",
    movieInfo,
    fromCache,
    updatedColumn: updateResult.column,
    error: null,
  };
}
