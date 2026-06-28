import app from "./app.js";
import { getSecret, isDevelopmentEnv, getEnv, logger, ENV_KEYS } from "./config/index.js";

const port = getSecret(ENV_KEYS.PORT) || 8080;
const serviceUrl = getSecret(ENV_KEYS.SERVICE_TAG_URL);

app.listen(port, () => {
  if (isDevelopmentEnv()) {
    logger.info(`app running locally on port ${port}`);
  } else {
    logger.info(`up and running listening on port:${port}, env=${getEnv()}, url=https://${serviceUrl}`);
  }
});
