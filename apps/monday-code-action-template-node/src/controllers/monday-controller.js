const initMondayClient = require('monday-sdk-js');
const mondayCodeService = require('../services/monday-code-service');

// Accessed through /monday_code/execute_action
async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  const mondayClient = initMondayClient();
  mondayClient.setToken(shortLivedToken);

  try {
    const response = await mondayCodeService.actionLogic({ requestPayload: payload, monday: mondayClient }) || {};
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

// Accessed through /monday_code/get_remote_list_options
async function getRemoteListOptions(req, res) {
  try {
    const remoteOptions = await mondayCodeService.getRemoteOptions();
    return res.status(200).send(remoteOptions);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  executeAction,
  getRemoteListOptions
};
