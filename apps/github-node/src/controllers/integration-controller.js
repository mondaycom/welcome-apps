const subscriptionModelService = require('../services/model-services/subscription-model-service');
const mondayTriggersService = require('../services/monday-triggers-service');
const githubService = require('../services/github-service');

async function integrationEventsHandler(req, res) {
  const { subscriptionId } = req.params;
  const body = req.body;

  if (body.hook_id) {
    // github webhhok verification
    return res.status(200).send({ success: true });
  }

  try {
    const { action, issue } = body;
    if (action != 'opened') {
      //create item only when issue is opened
      return res.status(200).send();
    }

    const { mondayWebhookUrl } = await subscriptionModelService.getSubscription(subscriptionId);

    const convertedIssue = githubService.convertIssueToPrimitives(issue);

    await mondayTriggersService.triggerMondayIntegration(mondayWebhookUrl, { issue: convertedIssue });

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  integrationEventsHandler,
};
