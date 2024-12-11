import { EnvironmentVariablesManager, Logger, SecretsManager, SecureStorage, Storage } from '@mondaycom/apps-sdk';
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

import { transformText } from './src/transformation-service.js';
import { authorizeRequest } from './src/middleware.js';
import { changeColumnValue, getColumnValue, platformApiHealthCheck } from './src/monday-api-service.js';
import { getEnv, getSecret, isDevelopmentEnv } from './src/helpers.js';
import { produceMessage, readQueueMessage } from './src/queue-service.js';

const envs = new EnvironmentVariablesManager({ updateProcessEnv: true });

dotenv.config();

const logTag = 'ExpressServer';
const PORT = 'PORT';
const SERVICE_TAG_URL = 'SERVICE_TAG_URL';
const TO_UPPER_CASE = 'TO_UPPER_CASE';
const TO_LOWER_CASE = 'TO_LOWER_CASE';
const TO_CURRENT_REGION = 'TO_LOWER_CASE';

const logger = new Logger(logTag);
const currentPort = getSecret(PORT); // Port must be 8080 to work with monday code
const currentUrl = getSecret(SERVICE_TAG_URL);

const app = express();
app.use(express.json());

async function produceMessageWithPayload(body) {
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    body = {
      message: 'This is an auto generated body because we got null',
      date: new Date().toISOString(),
      bool: true
    };
  }
  const message = JSON.stringify(body);
  return await produceMessage(message);
}

app.get('/', (req, res) => {
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
      'region (from env)': processEnv.MNDY_REGION || 'null',
      'last code change (hard coded)': '2024-12-10T23:54:00.000Z',
      'revision tag (from env)': processEnv.MNDY_TOPIC_NAME || 'null'
    },
    secretsObject,
    envsObject,
    processEnv,
    now: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/super-health', async (req, res) => {
  logger.info(`hello from info`);
  logger.error(`hello from error`);
  logger.error(`hello from error WITH error string`, { error: 'error string' });
  logger.error(`hello from error WITH error object`, { error: new Error('error class instance') });
  logger.warn(`hello from warn`);
  logger.debug(`hello from debug`);

  const now = Date.now() + '';

  const messageId = await produceMessageWithPayload({ message: 'hello from super-health', now });

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
    healthy: 'OK',
    timestamp: now,
    secretsObject,
    envsObject,
    producedQueueMessageId: messageId
  });
});

const testStorage = async () => {
  const token = envs.get('MY_TOKEN') + '';
  const storage = new Storage(token);
  await storage.set('maors_test_app', JSON.stringify({ my_key: 'my_value', now: new Date().toISOString() }));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await storage.get('maors_test_app');
};

const testSecureStorage = async () => {
  const token = envs.get('MY_TOKEN') + '';
  const secureStorage = new SecureStorage(token);
  await secureStorage.set('maors_test_app', JSON.stringify({ my_key: 'my_value', now: new Date().toISOString() }));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await secureStorage.get('maors_test_app');
};

app.get('/networking', async (req, res) => {
  const asyncApiCalls = {
    'http://example.com': axios.get('http://example.com', { timeout: 5000 }),
    'http://api.ipify.org': axios.get('http://api.ipify.org', { timeout: 5000 }),
    'http://142.250.74.14 (Google HTTP server)': axios.get('http://142.250.74.14', { timeout: 5000 }), // An IP address of a Google server that responds to HTTP requests.
    'http://1.1.1.1 (Cloudflare public DNS)': axios.get('http://1.1.1.1', { timeout: 5000 }), // An IP address of a Google server that responds to HTTP requests.
    'Platform-API (GraphQL with SDK client)': platformApiHealthCheck(envs.get('MY_TOKEN') + ''),
    'AppsSDK - Queue - produce message:': produceMessageWithPayload(),
    'AppsSDK - Storage:': testStorage(),
    'AppsSDK - SecureStorage:': testSecureStorage()
  };


// TODO: add more external API calls

  const results = {};
  for (const [name, asyncApiCall] of Object.entries(asyncApiCalls)) {
    try {
      const response = await asyncApiCall;
      results[name] = `Success: ${response.status}`;
    } catch (error) {
      if (error.response) {
        results[name] = `Failed: ${error.response.status}`;
      } else {
        results[name] = `Failed: ${error.message}`;
      }
    }
  }


  res.json(results);
});

// TODO: MAOR: Dont forget to add the app signing secret as env var (MONDAY_SINGING_SECRET) in production to make integration work

app.post('/monday/execute_action', authorizeRequest, async (req, res) => {
  logger.info(
    JSON.stringify({
      message: 'New request received',
      path: '/monday/execute_action',
      body: req.body,
      headers: req.headers
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
      transformationType
    } = inputFields;

    const text = await getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }
    const transformedText = transformText(
      text,
      transformationType ? transformationType.value : 'TO_UPPER_CASE'
    );

    await changeColumnValue(
      shortLivedToken,
      boardId,
      itemId,
      targetColumnId,
      transformedText
    );

    logger.info(`changeColumnValue finished: ${JSON.stringify({
      shortLivedToken,
      boardId,
      itemId,
      targetColumnId,
      transformedText
    })}`);
    return res.status(200).send({ itemId, targetColumnId, transformedText });
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
      { title: 'to lower case', value: TO_LOWER_CASE },
      { title: 'to current region', value: TO_CURRENT_REGION }
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
      const messageId = await produceMessageWithPayload(body);
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
