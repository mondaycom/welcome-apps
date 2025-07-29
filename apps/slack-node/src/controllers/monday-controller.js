const connectionModelService = require('../services/model-services/connection-model-service');
const slackService = require('../services/slack-service');
const MondayService = require('../services/monday-service');

async function executeAction(req, res) {
  const { shortLivedToken } = req.monday;
  const { inputFields } = req.body.payload;

  try {
    const token = req.body?.payload?.credentialsValues?.slack_credentials?.accessToken;

    if (!token) {
      return res.status(400).send({ message: 'No Slack token found' });
    }

    const { boardId, channel, itemId, columnId } = inputFields;

    // Get the item title from monday.com
    const itemTitle = await MondayService.getItemTitle(shortLivedToken, itemId);
    const { type, value } = (await MondayService.getStatusColumn(shortLivedToken, boardId, itemId, columnId)) || {};

    // Create dynamic message
    const message = `The item "${itemTitle}" has had its ${type} updated to "${value}".`;

    await slackService.postMessage(token, channel, message);

    return res.status(200).send();
  } catch (err) {
    if (err.code === 'slack_webapi_platform_error') {
      return res.status(401).send({
        message: 'Slack token has been revoked or is invalid. Please re-authorize the Slack integration.',
        error_code: 'SLACK_AUTH_ERROR',
      });
    }
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getRemoteListOptions(req, res) {
  try {
    const token = req.body?.payload?.credentialsValues?.credentianals?.accessToken;

    if (!token) {
      return res.status(400).send({ message: 'No Slack token found' });
    }

    const options = await slackService.getChannels(token);
    return res.status(200).send(options);
  } catch (err) {
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  executeAction,
  getRemoteListOptions,
};
