import { Logger } from "@mondaycom/apps-sdk";
import { changeColumnValue, getBoardColumns } from "./monday-api.service.js";
import { extractMovieInfo, fetchMovieData } from "./omdb-api.service.js";
import type { MovieData, MovieInfo } from "./omdb-api.service.js";
import { cacheMovieData, getCachedMovieData } from "./storage.service.js";

const logger = new Logger("OmdbService");

const STORAGE_PROPAGATION_DELAY_MS = 1000;

interface MovieCacheResult {
  movieData: MovieData | null;
  movieInfo: MovieInfo | null;
  fromCache: boolean;
}

async function getMovieDataWithCache(token: string, movieTitle: string): Promise<MovieCacheResult> {
  let movieData: MovieData | null = null;
  let fromCache = false;

  try {
    movieData = await getCachedMovieData(token, movieTitle);
    if (movieData) {
      fromCache = true;
      logger.info(`Using cached movie data for: ${movieTitle}`);
    }
  } catch (cacheErr) {
    logger.warn(`Cache retrieval failed for ${movieTitle}: ${(cacheErr as Error).message}`);
  }

  if (!movieData) {
    movieData = await fetchMovieData(movieTitle);

    if (!movieData) {
      return { movieData: null, movieInfo: null, fromCache: false };
    }

    try {
      const cached = await cacheMovieData(token, movieTitle, movieData);
      if (cached) {
        await new Promise((resolve) => setTimeout(resolve, STORAGE_PROPAGATION_DELAY_MS));
      }
    } catch (cacheErr) {
      logger.warn(`Failed to cache movie data for ${movieTitle}: ${(cacheErr as Error).message}`);
    }
  }

  const movieInfo = extractMovieInfo(movieData);
  return { movieData, movieInfo, fromCache };
}

interface BoardColumn {
  id: string;
  title: string;
  type: string;
}

async function findTextColumn(token: string, boardId: string): Promise<BoardColumn | null> {
  const columns = await getBoardColumns(token, boardId);
  return columns.find((col) => col.type === "text" || col.type === "long_text") || null;
}

interface UpdateResult {
  success: boolean;
  column: { id: string; title: string; type: string } | null;
  error: string | null;
}

async function updateBoardWithMoviePlot(token: string, boardId: string, pulseId: string, movieInfo: MovieInfo): Promise<UpdateResult> {
  const textColumn = await findTextColumn(token, boardId);

  if (!textColumn) {
    return { success: false, column: null, error: "No text column found on board" };
  }

  const columnValue = JSON.stringify(movieInfo.plot);
  await changeColumnValue(token, boardId, pulseId, textColumn.id, columnValue);

  logger.info(`Updated column ${textColumn.id} with movie plot for board ${boardId}, item ${pulseId}`);

  return {
    success: true,
    column: { id: textColumn.id, title: textColumn.title, type: textColumn.type },
    error: null,
  };
}

export interface MovieLookupEvent {
  boardId: string;
  pulseId: string;
  pulseName: string;
}

export interface MovieLookupResult {
  success: boolean;
  message: string;
  movieInfo: MovieInfo | null;
  fromCache: boolean;
  updatedColumn: { id: string; title: string; type: string } | null;
  searchedTitle?: string;
  error?: string | null;
}

export async function processMovieLookup(token: string, event: MovieLookupEvent): Promise<MovieLookupResult> {
  const { boardId, pulseId, pulseName: movieTitle } = event;

  logger.info(`Processing movie lookup: ${movieTitle} (board: ${boardId}, item: ${pulseId})`);

  const { movieInfo, fromCache } = await getMovieDataWithCache(token, movieTitle);

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

  logger.info(`Movie data retrieved for ${movieTitle}, fromCache: ${fromCache}`);

  const updateResult = await updateBoardWithMoviePlot(token, boardId, pulseId, movieInfo);

  if (!updateResult.success) {
    return {
      success: true,
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
