const connectionService = require('../services/model-services/connection-model-service');
const LoggerService = require('../services/monday-code/logger-service');
const { WebClient } = require('@slack/web-api');

/**
 * Handle Slack provider unique identifier endpoint
 */
async function handleSlackProviderIdentifier(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .set({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
        })
        .json({
          error: 'No token provided in request body',
        });
    }

    const slack = new WebClient(token);

    const authTest = await slack.auth.test();

    if (!authTest.user_id || !authTest.team_id) {
      return res
        .status(500)
        .set({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
        })
        .json({
          error: 'Invalid Slack token or missing user information',
        });
    }

    const userInfo = await slack.users.info({ user: authTest.user_id });

    const response = {
      providerUniqueIdentifier: `${authTest.team_id}-${authTest.user_id}`,
      displayName: userInfo.user?.real_name || userInfo.user?.name || authTest.user || 'Unknown User',
    };

    LoggerService.getInstance().info(
      `Provider identifier created for user: ${response.displayName} (${response.providerUniqueIdentifier})`
    );

    return res
      .status(200)
      .set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      })
      .json(response);
  } catch (error) {
    LoggerService.getInstance().error('Failed to handle Slack provider identifier', error);

    return res
      .status(500)
      .set({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      })
      .json({
        error: 'Failed to get user identifier from Slack',
        details: error.message,
      });
  }
}

module.exports = {
  handleSlackProviderIdentifier,
};
