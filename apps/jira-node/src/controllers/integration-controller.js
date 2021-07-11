const jiraService = require('../services/jira-service');
const subscriptionModelService = require('../services/model-services/subscription-model-service');
const mondayTriggersService = require('../services/monday-service');

async function integrationEventsHandler(req, res) {
  const { subscriptionId } = req.params;
  const body = req.body;
  try {
    const issue = body.issue;
    const fields = issue.fields;
    const { mondayWebhookUrl } = await subscriptionModelService.getSubscription(subscriptionId);
    const convertedIssue = jiraService.convertIssueToPrimitives(issue, fields);
    const issueId = convertedIssue.id;
    await mondayTriggersService.triggerMondayIntegration(mondayWebhookUrl, { issueFields: convertedIssue, issueId: issueId });
    return res.status(200).send(issueId);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  integrationEventsHandler
};
