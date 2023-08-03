import { SubscriptionModelService } from '../services/model-services/subscription-model-service.js';
import { ConnectionModelService } from '../services/model-services/connection-model-service.js';
import * as githubService from '../services/github-service.js';
import * as mondayTriggersService from '../services/monday-triggers-service.js';
import logger from '../services/logger/index.js';

const TAG = 'trigger_controller';
const connectionModelService = new ConnectionModelService();

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

    /**
     * 1. Store token by generated Subscription ID
     * 2. Store data related to subscription in monday-code storage api
     */

    const { mondayToken, githubToken } = await connectionModelService.getConnectionByUserId(userId);
    const subscriptionModelService = new SubscriptionModelService(mondayToken);
    const { id: subscriptionId } = await subscriptionModelService.createSubscription({
      mondayWebhookUrl: webhookUrl,
      owner,
      repo,
      mondayUserId: userId
    });
    const events = ['issues'];

    const webhookId = await githubService.createWebhook(githubToken, owner, repo, subscriptionId, events);
    await subscriptionModelService.updateSubscription(subscriptionId, { webhookId });
    return res.status(200).send({ webhookId: subscriptionId });
  } catch (err) {
    logger.error('failed to subscribe to webhook', TAG, { userId, error: err.message });
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
    const { githubToken, mondayToken } = await connectionModelService.getConnectionByUserId(userId);
    const subscriptionModelService = new SubscriptionModelService(mondayToken);
    const { owner, repo, webhookId } = await subscriptionModelService.getSubscription(subscriptionId);

    await githubService.deleteWebhook(githubToken, owner, repo, webhookId);
    await subscriptionModelService.deleteSubscription(subscriptionId);
    return res.status(200).send({ result: 'Unsubscribed successfully.' });
  } catch (err) {
    logger.error('failed to unsbscribe', TAG, { userId, error: err.message, subscriptionId });
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

  const { action, issue } = body;
  try {
    logger.info('trigger received', TAG, { subscriptionId, action, issueId: issue.id });
    if (action !== 'opened') {
      // Only invoke trigger when an issue is opened
      return res.status(200).send();
    }

    const subscriptionModelService = new SubscriptionModelService();
    const userId = await subscriptionModelService.getUserIdBySubscriptionId(subscriptionId);
    const { mondayToken } = await connectionModelService.getConnectionByUserId(userId);

    // Get the Subscription object and the corresponding monday webhook URL
    const { mondayWebhookUrl } = await subscriptionModelService.getSubscription(subscriptionId, mondayToken);

    // Converts the incoming issue to mappable fields in monday
    // Docs: https://developer.monday.com/apps/docs/dynamic-mapping#part-3-using-inbound-mapping-your-app-to-mondaycom
    const convertedIssue = githubService.convertIssueToPrimitives(issue);

    // Call the monday webhook URL
    await mondayTriggersService.triggerMondayIntegration(mondayWebhookUrl, { issue: convertedIssue });

    return res.status(200).send();
  } catch (err) {
    logger.error('failed to trigger', TAG, { subscriptionId, error: err.message, action, issueId: issue.id });
    return res.status(500).send({ message: 'internal server error' });
  }
}
