import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  clientAuth,
  exchangeAuthorizationCodeForToken,
  checkOAuthToken,
  authenticationMiddleware,
} from '../middlewares/authentication';
import logger from '../utils/logger';
import {
  handleChangeColumnValue,
  handleGetColumnValue,
} from '../controllers/monday-controller';
import { getSecret } from '../utils/secrets-manager';
import { EnvManager } from '../utils/env-manager';

import { secureStorageDelete } from '../utils/secure-storage';

const router = Router();

router.post('/api/monday/oauth-flow', clientAuth, checkOAuthToken);

router.get('/oauth/callback', async (req, res) => {
  const { code, state: token } = req.query;

  const clientSecret = getSecret('CLIENT_SECRET');
  const decodedToken = jwt.verify(token as string, clientSecret as string);
  const { user_id, account_id, slug } = (decodedToken as jwt.JwtPayload)
    .dat as {
    account_id: string;
    user_id: string;
    slug: string;
  };

  try {
    // Exchange authorization code for access token here
    await exchangeAuthorizationCodeForToken(
      code,
      user_id,
      account_id,
      slug,
      clientSecret as string
    );

    // After successful token retrieval, redirect the user to the main screen

    res.redirect(`${new EnvManager().get('LIVE_URL')}`);
  } catch (error) {
    // Handle error cases
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

//get LIVE URL for the FE
router.get('/live-url', async (req, res) => {
  res.status(200).send({ url: new EnvManager().get('LIVE_URL') });
});

if (process.env.NODE_ENV === 'development') {
  // Uninstall endpoint to delete oauth token only for testing purposes
  router.post('/delete-oauth-token', async (req, res) => {
    const { account_id } = req.body;
    try {
      await secureStorageDelete(`${account_id}-token`);
      return res.status(200).send({ success: true });
    } catch (err) {
      logger.error((err as Error).message);
      return res.status(500).send({ message: 'Error deleting Oauth token' });
    }
  });
}

// Example routes
router.post(
  '/get-column-value',
  authenticationMiddleware,
  handleGetColumnValue
);

router.post(
  '/change-column-value',
  authenticationMiddleware,
  handleChangeColumnValue
);

export default router;
