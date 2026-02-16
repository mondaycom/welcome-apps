import jwt from 'jsonwebtoken';
import axios from 'axios';

import logger from '../utils/logger';

import { Request, Response, NextFunction } from 'express';
import { EnvManager } from '../utils/env-manager';
import { getSecret } from '../utils/secrets-manager';
import { secureStorageGet, secureStorageSet } from '../utils/secure-storage';

// Initialize the environment variables manager without injecting env into `process.env`
let envManager = new EnvManager();

/** Define the session property on the request object   */
declare global {
  namespace Express {
    interface Request {
      session: {
        accountId: string;
        userId: string;
        backToUrl: string;
        token: string;
      };
    }
  }
}

async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // if .env LOCAL=TRUe we enable local development by going next with a session setup
    if (applyLocalSessionIfEnabled(req)) {
      logger.info('Using local session for authenticationMiddleware');
      return next();
    }

    logger.info('Authenticating user');
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token as string;
    }

    if (!authorization) {
      throw new Error('Not authenticated no authorization');
    }

    const signingSecret = getSecret('MONDAY_SIGNING_SECRET') as string;

    if (!signingSecret) {
      throw new Error('Signing secret is not defined');
    }

    const decodedToken = jwt.verify(
      authorization,
      signingSecret
    ) as jwt.JwtPayload;

    const { accountId, userId, backToUrl, shortLivedToken } = decodedToken;
    req.session = { accountId, userId, backToUrl, token: shortLivedToken };
    next();
  } catch (err) {
    logger.error((err as Error).message);
    res
      .status(500)
      .json({ error: 'Not authenticated no authorization -authMiddleware' });
  }
}

async function clientAuth(req: Request, res: Response, next: NextFunction) {
  // if .env LOCAL=TRUe we enable local development by going next with a session setup
  if (applyLocalSessionIfEnabled(req)) {
    logger.info('Using local session for client auth');
    return next();
  }

  let { authorization } = req.headers;
  if (!authorization && req.query) {
    authorization = req.query.token as string;
  }

  if (!authorization) {
    return res.status(401).json({ error: 'Not authenticated client auth' });
  }

  const clientSecret = getSecret('CLIENT_SECRET');

  try {
    const decodedToken = jwt.verify(authorization, clientSecret as string);
    if (
      typeof decodedToken !== 'object' ||
      decodedToken === null ||
      !('dat' in decodedToken)
    ) {
      throw new Error('Invalid token structure');
    }

    const { user_id, account_id, slug } = decodedToken.dat as {
      account_id: string;
      user_id: string;
      slug: string;
    };

    if (!user_id || !account_id || !slug) {
      return res
        .status(400)
        .json({ message: 'Missing required session information' });
    }

    req.session = {
      accountId: account_id,
      userId: user_id,
      backToUrl: slug,
      token: (await secureStorageGet(`${account_id}-token`)) as string,
    };

    next();
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ error: 'Invalid Monday FE' });
  }
}

async function checkOAuthToken(req: Request, res: Response) {
  // if .env LOCAL=TRUe we enable local development by going next with a session setup
  if (envManager.get('LOCAL') === 'true') {
    logger.info('Using local for oauth token');
    return res
      .status(200)
      .send({ authenticated: true, oAuthToken: envManager.get('API_KEY') });
  }

  // This is currently done by account so that we can delete the token if the user disconnects the app from the whole account
  // future state secure storage will be able to segregate by account which will allow us to store the token by user
  const { accountId } = req.session;
  try {
    const storageResponse = await secureStorageGet(`${accountId}-token`);

    const oAuthToken = storageResponse ? storageResponse : null;

    return res.status(200).send({ authenticated: !!oAuthToken, oAuthToken });
  } catch (err) {
    logger.error((err as Error).message);
    return res.status(500).send({ message: 'Error checking Oauth' });
  }
}

async function exchangeAuthorizationCodeForToken(
  code: any,
  user_id: string,
  account_id: string,
  slug: string,
  clientSecret: string
) {
  try {
    // Work around Node.js default behavior of preventing self signed certs when running
    if (process.env.ENVIRONMENT === 'development') {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const LIVE_URL = envManager.get('LIVE_URL');
    const CLIENT_ID = envManager.get('CLIENT_ID');

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://auth.monday.com/oauth2/token',
      {
        client_id: CLIENT_ID,
        client_secret: clientSecret,
        redirect_uri: `${LIVE_URL}/oauth/callback`,
        code: code,
      }
    );

    // Store Token in secure storage
    const storageResponse = await secureStorageSet(
      `${account_id}-token`,
      tokenResponse.data.access_token
    );

    return tokenResponse.data; // return the token data for further use
  } catch (err) {
    logger.error('Error exchanging authorization code for token:', {
      error: err as Error,
    });
    throw new Error('Failed to authenticate');
  }
}

function applyLocalSessionIfEnabled(req: Request): boolean {
  // Check if local development mode is enabled
  if (envManager.get('LOCAL') === 'true') {
    const accountId = envManager.get('ACCOUNT_ID');
    const userId = envManager.get('USER_ID');
    const slug = envManager.get('SLUG');
    const api_key = envManager.get('API_KEY');

    req.session = {
      accountId: (accountId as string) || '',
      userId: (userId as string) || '',
      backToUrl: (slug as string) || '',
      token: (api_key as string) || '',
    };

    return true; // Local session was applie
  }

  return false; // No local session was applied
}

const webhookChallenge = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.challenge) {
    return res.status(200).send(req.body);
  }
  next();
};

export {
  authenticationMiddleware,
  clientAuth,
  checkOAuthToken,
  exchangeAuthorizationCodeForToken,
  webhookChallenge,
};
