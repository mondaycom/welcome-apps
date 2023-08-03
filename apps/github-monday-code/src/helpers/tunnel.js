import { createTunnel } from '@mondaydotcomorg/tunnel';
import { cache, cacheKeys } from '../services/cache-service.js';
import  { isDevelopmentEnv } from './environment.js';

const MAX_RETRIES = 5;

export const createDevTunnel = async (port, retries = 0) => {
  if (!isDevelopmentEnv()) return;

  const tunnel = await createTunnel({
    port,
    subdomain: process.env.TUNNEL_SUBDOMAIN,
  });
  const { url } = tunnel;

  const usedSubDomain = url.includes(process.env.TUNNEL_SUBDOMAIN);
  if (!usedSubDomain && retries < MAX_RETRIES) {
    console.warn('could not use requested subdomain, retrying');
    tunnel.close();
    return setTimeout(() => {
      createDevTunnel(port, ++retries);
    }, 200);
  }

  cache.set(cacheKeys.SERVER_URL, url);

  if (!usedSubDomain) {
    console.warn('could not use requested subdomain, generated a random one');
  }
  console.log(`listening at localhost:${port} || tunnel: ${url}`);
};
