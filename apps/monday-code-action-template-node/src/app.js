require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const { PORT: port, NODE_ENV: env } = process.env;

let createTunnel
if (env !== 'production') {
  createTunnel = require('./helpers/tunnel').createTunnel();
}

const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, async () => {
  console.log(`listening at localhost:${port}`);
  if (env !== 'production') await createTunnel(port);
});

module.exports = app;
