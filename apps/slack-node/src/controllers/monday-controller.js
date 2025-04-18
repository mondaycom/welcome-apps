const connectionModelService = require('../services/model-services/connection-model-service');
const slackService = require('../services/slack-service');
const LoggerService = require('../services/monday-code/logger-service');

async function executeAction(req, res) {
  const { userId } = req.session;
  const { inputFields } = req.body.payload;

  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const { channel, text } = inputFields;
    await slackService.postMessage(token, channel.value, text);

    return res.status(200).send();
  } catch (err) {
    LoggerService.getInstance().error('Error executing action', err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getRemoteListOptions(req, res) {
  const { userId } = req.session;
  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const options = await slackService.getChannels(token);
    return res.status(200).send(options);
  } catch (err) {
    LoggerService.getInstance().error('Error getting remote list options', err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  executeAction,
  getRemoteListOptions,
};
