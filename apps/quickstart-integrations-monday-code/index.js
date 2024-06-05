import { EnvironmentVariablesManager, Logger, SecretsManager } from '@mondaycom/apps-sdk';
import dotenv from 'dotenv';
import express from 'express';

import { transformText } from './src/transformation-service.js';
import { authorizeRequest } from './src/middleware.js';
import { changeColumnValue, getColumnValue } from './src/monday-api-service.js';
import { getEnv, getSecret, isDevelopmentEnv } from './src/helpers.js';
import { produceMessage, readQueueMessage } from './src/queue-service.js';

const envs = new EnvironmentVariablesManager({ updateProcessEnv: true });

dotenv.config();


const logTag = 'ExpressServer';
const PORT = 'PORT';
const SERVICE_TAG_URL = 'SERVICE_TAG_URL';
const TO_UPPER_CASE = 'TO_UPPER_CASE';
const TO_LOWER_CASE = 'TO_LOWER_CASE';

const logger = new Logger(logTag);
const currentPort = getSecret(PORT); // Port must be 8080 to work with monday code
const currentUrl = getSecret(SERVICE_TAG_URL);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  logger.info(`hello from info`);
  logger.error(`hello from error`);
  logger.error(`hello from error WITH error string`, { error: 'error string' });
  logger.error(`hello from error WITH error object`, { error: new Error('error class instance') });
  logger.warn(`hello from warn`);
  logger.debug(`hello from debug`);

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
    hard_coded_data: { // FIXME: change for each deployment
      'region (from env)': process.env.MNDY_REGION || 'null',
      'created_at (hard coded)': '2024-05-27T15:47:00.000Z'
    },
    secretsObject,
    envsObject,
    processEnv,
    now: new Date().toISOString()
  });
});

// TODO: MAOR: Dont forget to add the app signing secret as env var in production to make integration work

app.post('/monday/execute_action', authorizeRequest, async (req, res) => {
  logger.info(
    JSON.stringify({
      message: 'New request received',
      path: '/action',
      body: req.body,
      headers: req.headers
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
      targetColumnId
      // transformationType
    } = inputFields;

    const text = await getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }
    const transformedText = transformText(
      text,
      TO_UPPER_CASE
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
    logger.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
});

app.post(
  '/monday/get_remote_list_options',
  authorizeRequest,
  async (req, res) => {
    const TRANSFORMATION_TYPES = [
      { title: 'to upper case', value: TO_UPPER_CASE },
      { title: 'to lower case', value: TO_LOWER_CASE }
    ];
    try {
      return res.status(200).send(TRANSFORMATION_TYPES);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({ message: 'internal server error' });
    }
  }
);


app.post(
  '/produce',
  async (req, res) => {
    try {
      const { body } = req;
      const message = JSON.stringify(body);
      const messageId = await produceMessage(message);
      return res.status(200).send({ messageId });
    } catch (err) {
      logger.error(JSON.stringify(err));
      return res.status(500).send({ message: 'internal server error' });
    }
  }
);

app.post(
  '/mndy-queue',
  async (req, res) => {
    try {
      const { body, query } = req;
      readQueueMessage({ body, query });
      return res.status(200).send({}); // return 200 to ACK the queue message
    } catch (err) {
      logger.error(err.error);
      return res.status(500).send({ message: 'internal server error' });
    }
  }
);

app.listen(currentPort, () => {
  if (isDevelopmentEnv()) {
    logger.info(`app running locally on port ${currentPort}`);
  } else {
    logger.info(
      `up and running listening on port:${currentPort}`,
      'server_runner',
      {
        env: getEnv(),
        port: currentPort,
        url: `https://${currentUrl}`
      }
    );
  }
});
