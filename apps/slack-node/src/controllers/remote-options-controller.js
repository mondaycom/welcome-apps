const connectionService = require('../services/model-services/connection-model-service');
const LoggerService = require('../services/monday-code/logger-service');

/**
 * Handle Slack provider unique identifier endpoint
 * Monday.com sends the token directly in the request body after handling OAuth
 * This is where we save the connection to the database
 */
async function handleSlackProviderIdentifier(req, res) {
  try {
    const { token, userId, accountId } = req.body;

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

    // Use Slack Web API to get user info with the provided token
    const { WebClient } = require('@slack/web-api');
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

    // CRITICAL: Save the connection to database here using connection service
    // This is where the connection gets stored for later use
    try {
      // Use connection service to handle connection creation/update
      await connectionService.createConnection({
        userId: userId.toString(), // Ensure userId is stored as string
        userToken: token, // Pass as userToken since we don't know if it's bot or user token
        teamId: authTest.team_id,
        teamName: authTest.team, // Optional team name from auth.test
      });

      LoggerService.getInstance().info(`Successfully saved connection for user ${userId}, team ${authTest.team_id}`);
    } catch (dbError) {
      // Continue with provider identifier response even if DB save fails
      // This ensures OAuth flow completes successfully
      LoggerService.getInstance().error('Failed to save connection to database', dbError);
    }

    // Format response according to Monday.com's exact requirements
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
