import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { getSecret } from './helpers/secret-store.js';
import { PORT } from './constants/secret-keys.js';

dotenv.config();

const port = getSecret(PORT);
const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  console.log(`listening at localhost:${port} `);
});
