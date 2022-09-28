const mondayTunnel = require('@mondaydotcomorg/tunnel');

const MAX_RETRIES = 5;

const createTunnel = async (port, retries = 0) => {
  const tunnel = await mondayTunnel({
    host: process.env.TUNNEL_SERVER_HOST,
    port,
    subdomain: process.env.TUNNEL_SUBDOMAIN,
  });
  const { url } = tunnel;

  const usedSubDomain = url.includes(process.env.TUNNEL_SUBDOMAIN);
  if (!usedSubDomain && retries < MAX_RETRIES) {
    console.warn('could not use requested subdomain, retrying');
    tunnel.close();
    return setTimeout(() => {
      createTunnel(port, ++retries);
    }, 200);
  }

  if (!usedSubDomain) {
    console.warn('could not use requested subdomain, generated a random one');
  }
  console.log(`listening at localhost:${port} || tunnel: ${url}`);

  tunnel.on('close', () => {
    // tunnels are closed
  });
};

module.exports = { createTunnel };
