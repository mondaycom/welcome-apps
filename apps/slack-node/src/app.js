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
const remoteOptionsRoutes = require('./routes/remote-options');

const { PORT: port, LOCAL_SERVER_URL } = process.env;
const app = express();

// Session middleware - required for OAuth flow
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY || 'your-secret-key-here',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(bodyParser.json());
// Route middlewares
app.use('/monday', mondayRoutes);
app.use('/remote-options', remoteOptionsRoutes);
app.use('/', indexRoutes);
app.use(routes);
app.listen(port, () => {
  cache.set(cacheKeys.SERVER_URL, LOCAL_SERVER_URL);
  LoggerService.getInstance().info(`Slack integration listening on port ${port}`);
});

module.exports = app;
