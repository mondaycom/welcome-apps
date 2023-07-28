import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { getSecret } from './helpers/secret-store.js';
import { PORT } from './constants/secret-keys.js';
import logger from './services/logger/index.js';
import { getBaseUrl, getEnv } from './helpers/environment.js';
import { initializeDb } from './db/models/index.js';

initializeDb();

const TAG = 'server_runner';

// Port must be 8080 in order to work with monday code
const port = getSecret(PORT) || 8080;
const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  logger.info(`up and running listening on port:${port}`, TAG, { env: getEnv(), port, url: getBaseUrl() });
});
