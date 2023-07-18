import NodeCache from 'node-cache';

export const cache = new NodeCache();
export const cacheKeys = Object.freeze({
  SERVER_URL: 'serverUrl',
});
