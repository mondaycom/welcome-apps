const initMondayClient = require('monday-sdk-js');
const { functionTypes } = require('../consts/supported-function-types')

const mappedControllerFunctions = Object.freeze({
  [functionTypes.ACTION]: executeAction,
  [functionTypes.REMOTE_OPTIONS]: getRemoteListOptions
})

async function executeAction(req, res, func) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  const mondayClient = initMondayClient();
  mondayClient.setToken(shortLivedToken);

  try {
    const response = await func({ requestPayload: payload, monday: mondayClient }) || {};
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getRemoteListOptions(req, res, func) {
  try {
    const remoteOptions = await func();
    return res.status(200).send(remoteOptions);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  mappedControllerFunctions
};
