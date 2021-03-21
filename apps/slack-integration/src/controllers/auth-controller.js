const jwt = require('jsonwebtoken');
const {WebClient} = require('@slack/web-api');
const tokensService = require('../services/tokens-service');
const {cache, cacheKeys} = require('../services/cache-service')

const SCOPES = ['chat:write', 'commands', 'app_mentions:read', 'channels:read'];

const authorize = async (req, res) => {
  const {token} = req.query;
  const {userId, backToUrl} = jwt.verify(token, process.env.MONDAY_SIGNING_SECRET);
  try {
    // Check if token was created before for the user
    const slackAccessToken = await tokensService.getTokenByUserId(userId)
    if (slackAccessToken) {
      return res.redirect(backToUrl)
    }
  } catch (err) {
    console.log(`Token was not found for ${userId}`)
  }

  // Add `callback` as the callback function for the oauth flow
  const redirectUri = `${cache.get(cacheKeys.SERVER_URL)}/auth/${userId}/callback`

  // Start oauth flow with Slack
  const url = `https://slack.com/oauth/v2/authorize?scope=${SCOPES.join(",")}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${redirectUri}&state=${backToUrl}`

  return res.redirect(url);
};

const callback = async (req, res) => {
  const {userId} = req.params;
  const {code, state: backToUrl} = req.query
  try {
    // Request slack to generate oauth token using the `code` from the response
    const {access_token: accessToken} = await (new WebClient()).oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: `${cache.get(cacheKeys.SERVER_URL)}/auth/${userId}/callback`,
      code
    });

    // Save generated access token for the current userId
    await tokensService.storeToken(accessToken, userId);

    // Redirect back to monday.com
    return res.redirect(backToUrl);
  } catch (err) {
    return res.status(500).send(err)
  }
}

module.exports = {
  authorize,
  callback
};
