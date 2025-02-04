import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors-options';
import bodyParser from 'body-parser';
import routes from './routes/index';
import fs from 'fs';
import path from 'path';
import RateLimit from 'express-rate-limit';
import logger from './utils/logger';

console.log('Starting app');
const port = process.env.PORT ?? 8080;
const app = express();
app.set('trust proxy', 1 /* number of proxies between user and server */);

// TODO replace with an actual backoff system and learn how long monday code instance actually lasts
// Set up Rate Limiting
const limiter = RateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

// Set paths and serve static file. Needed when manually zipping front end for build
let staticPath = path.join(__dirname, '../client/build');
let indexPath = path.join(staticPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  staticPath = path.join(__dirname, 'client/build');
  indexPath = path.join(staticPath, 'index.html');
}

if (!fs.existsSync(indexPath)) {
  console.error(
    'Cannot find index.html. Please check your build process and file locations.'
  );
}

app.use(express.static(staticPath));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  logger.info(`App is running on port ${port}`);
});

export default app;
