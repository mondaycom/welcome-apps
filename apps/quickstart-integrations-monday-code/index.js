import {
  EnvironmentVariablesManager,
  Logger,
  SecretsManager,
  SecureStorage,
  Storage,
} from "@mondaycom/apps-sdk";
import axios from "axios";
import dotenv from "dotenv";
import express from "express";

import { getEnv, getSecret, isDevelopmentEnv } from "./src/helpers.js";
import { authorizeRequest } from "./src/middleware.js";
import {
  changeColumnValue,
  getColumnValue,
  getBoardColumns,
  platformApiHealthCheck,
} from "./src/monday-api-service.js";
import { fetchMovieData, extractMovieInfo } from "./src/omdb-api.js";
import { produceMessage, readQueueMessage } from "./src/queue-service.js";
import { cacheMovieData, getCachedMovieData } from "./src/storage-service.js";
import { transformText } from "./src/transformation-service.js";

const envs = new EnvironmentVariablesManager({ updateProcessEnv: true });

dotenv.config();

const logTag = "ExpressServer";
const PORT = "PORT";
const SERVICE_TAG_URL = "SERVICE_TAG_URL";
const TO_UPPER_CASE = "TO_UPPER_CASE";
const TO_LOWER_CASE = "TO_LOWER_CASE";
const TO_CURRENT_REGION = "TO_LOWER_CASE";
const DEV_ACCESS_TOKEN_ENV_NAME = "DEV_ACCESS_TOKEN";

const logger = new Logger(logTag);
const currentPort = getSecret(PORT); // Port must be 8080 to work with monday code
const currentUrl = getSecret(SERVICE_TAG_URL);

const app = express();
app.use(express.json());

async function produceMessageWithPayload(body) {
  if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
    body = {
      message: "This is an auto generated body because we got null",
      date: new Date().toISOString(),
      bool: true,
    };
  }
  const message = JSON.stringify(body);
  return await produceMessage(message);
}

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

app.get("/super-health", async (req, res) => {
  logger.info(`hello from info`);
  logger.error(`hello from error`);
  logger.error(`hello from error WITH error string`, { error: "error string" });
  logger.error(`hello from error WITH error object`, {
    error: new Error("error class instance"),
  });
  logger.warn(`hello from warn`);
  logger.debug(`hello from debug`);

  const now = Date.now() + "";

  const messageId = await produceMessageWithPayload({
    message: "hello from super-health",
    now,
  });

  const secrets = new SecretsManager();
  let secretsObject = {};
  for (const key of secrets.getKeys()) {
    secretsObject[key] = secrets.get(key);
  }

  let envsObject = {};
  for (const key of envs.getKeys()) {
    envsObject[key] = envs.get(key);
  }

  // TODO: Add more SDK functionality

  res.status(200).send({
    healthy: "OK",
    timestamp: now,
    secretsObject,
    envsObject,
    producedQueueMessageId: messageId,
  });
});

app.get("/error", (req, res) => {
  res.status(500).send({
    status: "ERROR",
    timestamp: new Date().toISOString(),
  });
});

app.get("/long", (req, res) => {
  const time = req.query.time ? Number(req.query.time) : 15000;
  setTimeout(() => {
    res.status(200).send({
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  }, time);
});

app.post("/mndy-cronjob/test", async (req, res) => {
  const now = Date.now() + "";

  const messageId = await produceMessageWithPayload({
    message: "hello from cronjob test endpoint produced message",
    now,
  });

  res.status(200).send({
    healthy: "OK",
    producedQueueMessageId: messageId,
  });
});

const testStorage = async () => {
  const token = envs.get(DEV_ACCESS_TOKEN_ENV_NAME) + "";
  const storage = new Storage(token);
  await storage.set(
    "maors_test_app",
    JSON.stringify({ my_key: "my_value", now: new Date().toISOString() }),
    { ttl: 3600 }
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await storage.get("maors_test_app");
};

const testSecureStorage = async () => {
  const token = envs.get(DEV_ACCESS_TOKEN_ENV_NAME) + "";
  const secureStorage = new SecureStorage(token);
  await secureStorage.set(
    "maors_test_app",
    JSON.stringify({ my_key: "my_value", now: new Date().toISOString() })
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await secureStorage.get("maors_test_app");
};

// TODO: MAOR: Dont forget to add
//  1. The app signing secret as env var (MONDAY_SINGING_SECRET) to make integration work
//  2. The dev access token to make API work (DEV_ACCESS_TOKEN)
app.get("/networking", async (req, res) => {
  try {
    const asyncApiCalls = {
      "http://example.com": axios.get("http://example.com", { timeout: 5000 }),
      "http://api.ipify.org": axios.get("http://api.ipify.org", {
        timeout: 5000,
      }),
      // 'http://192.0.43.10 (Example.com public ip)': axios.get('http://192.0.43.10', { timeout: 5000 }),
      // 'http://8.8.8.8 (Google DNS)': axios.get('http://8.8.8.8', { timeout: 5000 }),
      "http://1.1.1.1 (Cloudflare public DNS)": axios.get("http://1.1.1.1", {
        timeout: 5000,
      }),
      "http://34.102.212.0 (walla.co.il)": axios.get("http://34.102.212.0", {
        timeout: 5000,
      }),
      "-------------------------------------":
        "-------------------------------------",
      "Platform-API (GraphQL with SDK client)": platformApiHealthCheck(
        envs.get(DEV_ACCESS_TOKEN_ENV_NAME) + ""
      ),
      "AppsSDK - Queue - produce message:": produceMessageWithPayload(),
      "AppsSDK - Storage:": testStorage(),
      "AppsSDK - SecureStorage:": testSecureStorage(),
    };

    const results = {};

    for (const [name, asyncApiCall] of Object.entries(asyncApiCalls)) {
      if (typeof asyncApiCall === "string") {
        results[name] = asyncApiCall;
        continue;
      }

      try {
        const response = await asyncApiCall;

        let statusCode = null;
        if (response) {
          statusCode =
            response.status ||
            response.statusCode ||
            response.code ||
            response.responseCode ||
            response.res?.status ||
            response.res?.statusCode ||
            response.res?.code ||
            response.res?.responseCode ||
            JSON.stringify(response).substring(0, 100);
        }

        results[name] = `Success` + (statusCode ? `: ${statusCode}` : "");
      } catch (error) {
        if (error.response) {
          results[name] = `Failed: ${error.response.status}`;
        } else {
          results[name] = `Failed: ${error.message}`;
        }
      }
    }

    res.status(200).send(results);
  } catch (e) {
    console.error(e);
    res.status(200).send({
      message: "Wild exception thrown",
      error: e.message,
      stack: e.stack,
      JSON: JSON.stringify(e),
    });
  }
});

app.get("/storage", async (req, res) => {
  const item = await testStorage();

  res.status(200).send({
    item,
  });
});

// TODO: MAOR: Dont forget to add the app signing secret as env var (MONDAY_SINGING_SECRET) in production to make integration work

app.post("/monday/execute_action", authorizeRequest, async (req, res) => {
  logger.info(
    JSON.stringify({
      message: "New request received",
      path: "/monday/execute_action",
      body: req.body,
      headers: req.headers,
    })
  );
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    logger.info(`inputFields: ${JSON.stringify(inputFields)}`);
    const {
      boardId,
      itemId,
      sourceColumnId,
      targetColumnId,
      transformationType,
    } = inputFields;

    const text = await getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }
    const transformedText = transformText(
      text,
      transformationType ? transformationType.value : "TO_UPPER_CASE"
    );

    await changeColumnValue(
      shortLivedToken,
      boardId,
      itemId,
      targetColumnId,
      transformedText
    );

    logger.info(
      `changeColumnValue finished: ${JSON.stringify({
        shortLivedToken,
        boardId,
        itemId,
        targetColumnId,
        transformedText,
      })}`
    );
    return res.status(200).send({ itemId, targetColumnId, transformedText });
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ message: "internal server error" });
  }
});

app.post(
  "/monday/get_remote_list_options",
  authorizeRequest,
  async (req, res) => {
    const TRANSFORMATION_TYPES = [
      { title: "to upper case", value: TO_UPPER_CASE },
      { title: "to lower case", value: TO_LOWER_CASE },
      { title: "to current region", value: TO_CURRENT_REGION },
    ];
    try {
      return res.status(200).send(TRANSFORMATION_TYPES);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({ message: "internal server error" });
    }
  }
);

app.post("/produce", async (req, res) => {
  try {
    const { body } = req;
    const messageId = await produceMessageWithPayload(body);
    return res.status(200).send({ messageId });
  } catch (err) {
    logger.error(JSON.stringify(err));
    return res.status(500).send({ message: "internal server error" });
  }
});

app.post("/mndy-queue", async (req, res) => {
  try {
    const { body, query } = req;
    readQueueMessage({ body, query });
    return res.status(200).send({}); // return 200 to ACK the queue message
  } catch (err) {
    logger.error(err.error);
    return res.status(500).send({ message: "internal server error" });
  }
});

app.post("/incoming-webhook", async (req, res) => {
  try {
    const { body } = req;
    logger.info({ payload: body }, "Incoming webhook received");
    
    // Handle challenge for webhook verification - first time setup
    if (body.challenge) {
      return res.status(200).send({challenge: body.challenge});
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
      logger.warn({ boardId, pulseId, movieTitle }, "Missing required data in event");
      return res.status(200).send({});
    }

    logger.info({ movieTitle, boardId, pulseId }, "Processing movie lookup");

    // Get access token early since we'll need it for both API and caching
    const token = envs.get(DEV_ACCESS_TOKEN_ENV_NAME);
    if (!token) {
      logger.error("DEV_ACCESS_TOKEN not found in environment");
      return res.status(200).send({ 
        message: "Could not process request (missing token)"
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
      logger.warn({ movieTitle, error: cacheErr.message }, "Cache retrieval failed, will fetch fresh data");
    }

    // Step 2: If not cached, fetch movie data from OMDb API
    if (!movieData) {
      movieData = await fetchMovieData(movieTitle);
      
      if (!movieData) {
        logger.warn({ movieTitle }, "No movie data found");
        return res.status(200).send({ 
          message: "Movie not found",
          searchedTitle: movieTitle 
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
        logger.warn({ movieTitle, error: cacheErr.message }, "Failed to cache movie data");
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
    logger.info({ boardId, columnCount: columns.length }, "Found columns on board");

    // Find the first text or long_text column
    const textColumn = columns.find(col => col.type === "text" || col.type === "long_text");
    
    if (!textColumn) {
      logger.warn({ boardId }, "No text or long_text column found on the board");
      return res.status(200).send({ 
        message: "Movie data retrieved but no text column found on board",
        movieInfo 
      });
    }

    logger.info({ columnType: textColumn.type, columnTitle: textColumn.title, columnId: textColumn.id }, "Found text column");

    // Step 3: Update the column with the movie plot
    const columnValue = JSON.stringify(movieInfo.plot);
    await changeColumnValue(token, boardId, pulseId, textColumn.id, columnValue);
    
    logger.info({ columnId: textColumn.id, boardId, pulseId }, "Successfully updated column with movie plot");
    console.log(`✅ Updated "${textColumn.title}" column with movie plot`);

    return res.status(200).send({ 
      message: "Movie data retrieved and board updated successfully",
      fromCache,
      movieInfo,
      updatedColumn: {
        id: textColumn.id,
        title: textColumn.title,
        type: textColumn.type
      }
    });
  } catch (err) {
    logger.error({ error: err.message, stack: err.stack }, "Internal server error in webhook");
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
