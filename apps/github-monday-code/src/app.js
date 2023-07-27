import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { getSecret } from './helpers/secret-store.js';
import { PORT } from './constants/secret-keys.js';
import logger from './services/logger/index.js';
import { getEnv } from './helpers/environment.js';

const TAG = 'server_runner';
dotenv.config();

const port = getSecret(PORT);
const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  logger.info(`up and running listening on port:${port}`, TAG, { env: getEnv(), port });
});
