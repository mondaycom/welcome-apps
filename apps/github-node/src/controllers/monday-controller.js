const subscriptionModelService = require('../services/model-services/subscription-model-service');
const connectionModelService = require('../services/model-services/connection-model-service');
const githubService = require('../services/github-service');

async function subscribe(req, res) {
  const { userId } = req.session;
  const { payload } = req.body;
  const { inputFields, webhookUrl } = payload;

  try {
    const { value: repository } = inputFields.repository;
    const owner = repository.owner;
    const repo = repository.name;

    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const { id: subscriptionId } = await subscriptionModelService.createSubscription({
      mondayWebhookUrl: webhookUrl,
      owner,
      repo,
    });
    const events = ['issues'];

    const webhookId = await githubService.createWebhook(token, owner, repo, subscriptionId, events);
    await subscriptionModelService.updateSubscription(subscriptionId, { webhookId });
    return res.status(200).send({ webhookId: subscriptionId });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function unsubscribe(req, res) {
  const { userId } = req.session;
  const { webhookId: subscriptionId } = req.body.payload;

  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const { owner, repo, webhookId } = await subscriptionModelService.getSubscription(subscriptionId);

    await githubService.deleteWebhook(token, owner, repo, webhookId);
    await subscriptionModelService.deleteSubscription(subscriptionId);
    return res.status(200).send({ result: 'Unsubscribed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function executeAction(req, res) {
  const { userId } = req.session;
  const { inputFields } = req.body.payload;

  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);

    const { repository, issue } = inputFields;
    const owner = repository.value.owner;
    const repo = repository.value.name;

    await githubService.createIssue(token, owner, repo, issue);

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getRemoteListOptions(req, res) {
  const { userId } = req.session;
  try {
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const options = await githubService.getRepositories(token);
    return res.status(200).send(options);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getFieldDefs(req, res) {
  try {
    const fieldDefs = githubService.getIssueFieldDefs();
    return res.status(200).send(fieldDefs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  executeAction,
  getRemoteListOptions,
  getFieldDefs,
};
