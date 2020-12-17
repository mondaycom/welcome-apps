const NodeCache = require("node-cache");
const cache = new NodeCache();

const cacheKeys = Object.freeze({
  SERVER_URL: "serverUrl"
})

module.exports = {
  cache,
  cacheKeys
}
