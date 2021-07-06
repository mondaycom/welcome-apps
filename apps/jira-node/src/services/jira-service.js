const { cache, cacheKeys } = require('./cache-service');
const { ISSUE_FIELD_DEFS } = require('../constants/jira')
const fetch = require('node-fetch');
const user = process.env.USERNAME + ':' + process.env.API_KEY.toString();
const baseUrl = process.env.URL;

const createWebhook = async (jql, subscriptionId) => {
  try {
    var fetchUrl = `${baseUrl}/rest/webhooks/1.0/webhook/`;
    var targetUrl = `${cache.get(cacheKeys.SERVER_URL)}/integration/integration-events/${subscriptionId}/`;
    const bodyData = `{
      "name": "monday App Webhook",
      "url": ${JSON.stringify(targetUrl)},
      "events": [
          "jira:issue_created",
          "jira:issue_updated"
        ],
      "filters": {
        "issue-related-events-section": ${JSON.stringify(jql)}
      },
      "excludeBody": false
    }`;
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(user).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });
    const res = await response.json();
    return res.self.split("/").pop();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

const deleteWebhook = async (webhookId) => {
  try {
    var fetchUrl = `${baseUrl}/rest/webhooks/1.0/webhook/${webhookId}`;
    const response = await fetch(fetchUrl, {
      method: 'delete',
      headers: {
        'Authorization': `Basic ${Buffer.from(user).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    return await response.text();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

const convertIssueToPrimitives = (issue, fields) => {
  return {
    id: issue.id,
    key: issue.key,
    description: fields.summary,
    priority: fields.priority.name,
    status: fields.status.name,
    creator: fields.creator.displayName,
  }
}

const getIssueFieldDefs = () => {
  return ISSUE_FIELD_DEFS;
};

module.exports = {
  createWebhook,
  deleteWebhook,
  getIssueFieldDefs,
  convertIssueToPrimitives,
}