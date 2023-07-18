import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { createTunnel } from './helpers/tunnel.js';

dotenv.config();

const { PORT: port } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  createTunnel(port);
});
