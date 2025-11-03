import {
  EnvironmentVariablesManager,
  Logger,
  SecretsManager,
} from "@mondaycom/apps-sdk";
import dotenv from "dotenv";
import express from "express";

import { getEnv, getSecret, isDevelopmentEnv } from "./src/helpers.js";
import {
  changeColumnValue,
  getBoardColumns,
} from "./src/monday-api-service.js";
import { extractMovieInfo, fetchMovieData } from "./src/omdb-api.js";
import { cacheMovieData, getCachedMovieData } from "./src/storage-service.js";

const envs = new EnvironmentVariablesManager({ updateProcessEnv: true });

dotenv.config();

const logTag = "ExpressServer";
const PORT = "PORT";
const SERVICE_TAG_URL = "SERVICE_TAG_URL";
const DEV_ACCESS_TOKEN_ENV_NAME = "DEV_ACCESS_TOKEN";

const logger = new Logger(logTag);
const currentPort = getSecret(PORT); // Port must be 8080 to work with monday code
const currentUrl = getSecret(SERVICE_TAG_URL);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  const secrets = new SecretsManager();
  let secretsObject = {};
  for (const key of secrets.getKeys()) {
    secretsObject[key] = secrets.get(key);
  }

  let envsObject = {};
  for (const key of envs.getKeys()) {
    envsObject[key] = envs.get(key);
  }

  let processEnv = process.env;
  res.status(200).send({
    hard_coded_data: {
      // FIXME: change for each deployment
      "region (from env)": processEnv.MNDY_REGION || "null",
      "last code change (hard coded)": "2025-08-10T23:54:00.000Z",
      "revision tag (from env)": processEnv.MNDY_TOPIC_NAME || "null",
    },
    secretsObject,
    envsObject,
    processEnv,
    now: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).send({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.post("/incoming-webhook", async (req, res) => {
  try {
    const { body } = req;
    logger.info({ payload: body }, "Incoming webhook received");

    // Handle challenge for webhook verification - first time setup
    if (body.challenge) {
      return res.status(200).send({ challenge: body.challenge });
    }

    // Extract event data
    const event = body.event;
    if (!event) {
      logger.warn("No event data in webhook payload");
      return res.status(200).send({});
    }

    // Extract board ID, pulse ID, and pulse name
    const boardId = event.boardId;
    const pulseId = event.pulseId;
    const movieTitle = event.pulseName;

    if (!boardId || !pulseId || !movieTitle) {
      logger.warn(
        { boardId, pulseId, movieTitle },
        "Missing required data in event"
      );
      return res.status(200).send({});
    }

    logger.info({ movieTitle, boardId, pulseId }, "Processing movie lookup");

    // Get access token early since we'll need it for both API and caching
    const token = envs.get(DEV_ACCESS_TOKEN_ENV_NAME);
    if (!token) {
      logger.error("DEV_ACCESS_TOKEN not found in environment");
      return res.status(200).send({
        message: "Could not process request (missing token)",
      });
    }

    // Step 1: Check if we have cached movie data
    let movieData = null;
    let fromCache = false;

    try {
      movieData = await getCachedMovieData(token, movieTitle);
      if (movieData) {
        fromCache = true;
        logger.info({ movieTitle }, "Using cached data");
        console.log(`📦 Retrieved movie data from cache for: "${movieTitle}"`);
      }
    } catch (cacheErr) {
      logger.warn(
        { movieTitle, error: cacheErr.message },
        "Cache retrieval failed, will fetch fresh data"
      );
    }

    // Step 2: If not cached, fetch movie data from OMDb API
    if (!movieData) {
      movieData = await fetchMovieData(movieTitle);

      if (!movieData) {
        logger.warn({ movieTitle }, "No movie data found");
        return res.status(200).send({
          message: "Movie not found",
          searchedTitle: movieTitle,
        });
      }

      // Cache the movie data for future requests
      try {
        const cached = await cacheMovieData(token, movieTitle, movieData);
        if (cached) {
          console.log(`💾 Cached movie data for: "${movieTitle}"`);
          // Wait for storage to propagate (monday.com Storage API requirement)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (cacheErr) {
        logger.warn(
          { movieTitle, error: cacheErr.message },
          "Failed to cache movie data"
        );
        // Continue processing even if caching fails
      }
    }

    // Extract and format movie information
    const movieInfo = extractMovieInfo(movieData);
    logger.info({ movieInfo, fromCache }, "Movie data retrieved");

    // Print the result to console
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

    // Step 3: Get board structure and find a text or long_text column

    const columns = await getBoardColumns(token, boardId);
    logger.info(
      { boardId, columnCount: columns.length },
      "Found columns on board"
    );

    // Find the first text or long_text column
    const textColumn = columns.find(
      (col) => col.type === "text" || col.type === "long_text"
    );

    if (!textColumn) {
      logger.warn(
        { boardId },
        "No text or long_text column found on the board"
      );
      return res.status(200).send({
        message: "Movie data retrieved but no text column found on board",
        movieInfo,
      });
    }

    logger.info(
      {
        columnType: textColumn.type,
        columnTitle: textColumn.title,
        columnId: textColumn.id,
      },
      "Found text column"
    );

    // Step 3: Update the column with the movie plot
    const columnValue = JSON.stringify(movieInfo.plot);
    await changeColumnValue(
      token,
      boardId,
      pulseId,
      textColumn.id,
      columnValue
    );

    logger.info(
      { columnId: textColumn.id, boardId, pulseId },
      "Successfully updated column with movie plot"
    );
    console.log(`✅ Updated "${textColumn.title}" column with movie plot`);

    return res.status(200).send({
      message: "Movie data retrieved and board updated successfully",
      fromCache,
      movieInfo,
      updatedColumn: {
        id: textColumn.id,
        title: textColumn.title,
        type: textColumn.type,
      },
    });
  } catch (err) {
    logger.error(
      { error: err.message, stack: err.stack },
      "Internal server error in webhook"
    );
    return res.status(500).send({ message: "internal server error" });
  }
});

app.listen(currentPort, () => {
  if (isDevelopmentEnv()) {
    logger.info(`app running locally on port ${currentPort}`);
  } else {
    logger.info(
      `up and running listening on port:${currentPort}`,
      "server_runner",
      {
        env: getEnv(),
        port: currentPort,
        url: `https://${currentUrl}`,
      }
    );
  }
});
