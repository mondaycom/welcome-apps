import express from "express";
import { Logger } from "@mondaycom/apps-sdk";
import chalk from "chalk";
import {
  changeColumnValue,
  getColumnValue,
  transformText,
  authorizeRequest,
} from "./src/services.js";
import { getSecret, isDevelopmentEnv, getEnv } from "./src/helpers.js";
import dotenv from "dotenv";
dotenv.config();

const logTag = "ExpressServer";
const logger = new Logger(logTag);

// Port must be 8080 in order to work with monday code
const port = getSecret("PORT");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ message: "healthy" });
});

app.post("/monday/execute_action", authorizeRequest, async (req, res) => {
  logger.info(
    JSON.stringify({
      message: "New request received",
      path: "/action",
      body: req.body,
      headers: req.headers,
    })
  );
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
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

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "internal server error" });
  }
});

app.post("/monday/get_remote_list_options", authorizeRequest, async (req, res) => {
  const TRANSFORMATION_TYPES = [
    { title: "to upper case", value: "TO_UPPER_CASE" },
    { title: "to lower case", value: "TO_LOWER_CASE" },
  ];
  try {
    return res.status(200).send(TRANSFORMATION_TYPES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "internal server error" });
  }
});

app.listen(port, () => {
  if (isDevelopmentEnv()) {
    logger.info(`app running locally on port ${chalk.red(port)}`);
  } else {
    logger.info(`up and running listening on port:${port}`, 'server_runner', {
      env: getEnv(),
      port,
      url: `https://${getSecret("SERVICE_TAG_URL")}`,
    });
  }
});
