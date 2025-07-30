require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { cache, cacheKeys } = require('./services/cache-service');
const LoggerService = require('./services/monday-code/logger-service');

// Routes
const mondayRoutes = require('./routes/monday');
const indexRoutes = require('./routes/index');
const credentialsRoutes = require('./routes/credentials');

const { PORT: port, LOCAL_SERVER_URL } = process.env;
const app = express();

app.use(bodyParser.json());

// Route middlewares
app.use('/monday', mondayRoutes);
app.use('/credentials', credentialsRoutes);
app.use('/', indexRoutes);
app.use(routes);

app.listen(port, () => {
  cache.set(cacheKeys.SERVER_URL, LOCAL_SERVER_URL);
  LoggerService.getInstance().info(`Slack integration listening on port ${port}`);
});

module.exports = app;
