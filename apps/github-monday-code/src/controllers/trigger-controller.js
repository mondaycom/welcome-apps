import * as subscriptionModelService from '../services/model-services/subscription-model-service.js';
import * as connectionModelService from '../services/model-services/connection-model-service.js';
import * as githubService from '../services/github-service.js';
import * as mondayTriggersService from '../services/monday-triggers-service.js';
import logger from '../services/logger/index.js';

const TAG = 'trigger_controller';

/**
 * Creates a Subscription and Github webhook.
 * Called when a user adds the integration to their board.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#subscribing-to-your-trigger
 */
export async function subscribe(req, res) {
  const { userId } = req.session;
  const { payload } = req.body;
  const { inputFields, webhookUrl } = payload;

  try {
    const { value: repository } = inputFields.repository;
    const owner = repository.owner;
    const repo = repository.name;
    logger.info('subscribe trigger received', TAG, { userId, owner, repository: repo });

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
    logger.error('failed to subscribe to webhook', TAG, { userId, error: err });
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Removes the Subscription and webhook associated with a specific integration.
 * Called when a user deletes or turns off the integration on their board.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#unsubscribing-from-your-trigger
 */
export async function unsubscribe(req, res) {
  const { userId } = req.session;
  const { webhookId: subscriptionId } = req.body.payload;

  try {
    logger.info('unsubscribe trigger received', TAG, { userId, subscriptionId });
    const { token } = await connectionModelService.getConnectionByUserId(userId);
    const { owner, repo, webhookId } = await subscriptionModelService.getSubscription(subscriptionId);

    await githubService.deleteWebhook(token, owner, repo, webhookId);
    await subscriptionModelService.deleteSubscription(subscriptionId);
    return res.status(200).send({ result: 'Unsubscribed successfully.' });
  } catch (err) {
    logger.error('failed to unsbscribe', TAG, { userId, error: err, subscriptionId });
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Trigger the integration recipe.
 * Receives events from a Github webhook and & calls the corresponding monday webhook URL.
 * Docs: https://developer.monday.com/apps/docs/custom-trigger#calling-your-action
 */
export async function triggerEventsHandler(req, res) {
  const { subscriptionId } = req.params;
  const body = req.body;

  if (body.hook_id) {
    // Initial URL verification step from Github
    return res.status(200).send({ success: true });
  }

  try {
    const { action, issue } = body;
    logger.info('trigger received', TAG, { subscriptionId, action, issue });
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
    logger.error('failed to trigger', TAG, { subscriptionId, error: err, action, issue });
    return res.status(500).send({ message: 'internal server error' });
  }
}
