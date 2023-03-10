const subscriptionModelService = require('../services/model-services/subscription-model-service');
const connectionModelService = require('../services/model-services/connection-model-service');
const githubService = require('../services/github-service');
const mondayTriggersService = require('../services/monday-triggers-service');

/**
 * Creates a Subscription and Github webhook. 
 * Called when a user adds the integration to their board.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#subscribing-to-your-trigger
 */
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

/**
 * Removes the Subscription and webhook associated with a specific integration. 
 * Called when a user deletes or turns off the integration on their board.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#unsubscribing-from-your-trigger
 */
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

/**
 * Trigger the integration recipe by receive events from Github and then calling the corresponding monday webhook URL. 
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#calling-your-action
 */
async function integrationEventsHandler(req, res) {
  const { subscriptionId } = req.params;
  const body = req.body;

  if (body.hook_id) {
    // Initial URL verification step from Github
    return res.status(200).send({ success: true });
  }

  try {
    const { action, issue } = body;
    if (action != 'opened') {
      // Only invoke trigger when an issue is opened
      return res.status(200).send();
    }

    // Get the Subscription object and the corresponding monday webhook URL
    const { mondayWebhookUrl } = await subscriptionModelService.getSubscription(subscriptionId);

    // Converts the incoming issue to mappable fields in monday
    // Docs: https://developer.monday.com/apps/docs/dynamic-mapping#part-3-using-inbound-mapping-your-app-to-mondaycom
    const convertedIssue = githubService.convertIssueToPrimitives(issue);

    // Call the monday webhook URL
    await mondayTriggersService.triggerMondayIntegration(mondayWebhookUrl, { issue: convertedIssue });

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  integrationEventsHandler,
}
