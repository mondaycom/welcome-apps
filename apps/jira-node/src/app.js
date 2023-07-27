require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const routes = require('./routes');
const { createTunnel } = require('./helpers/tunnel');

// Port must be 8080 in order to work with monday code
const { PORT: port } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  createTunnel(port);
});

module.exports = app;
