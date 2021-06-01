const { cache, cacheKeys } = require('./cache-service');
const { ISSUE_FIELD_DEFS } = require('../constants/jira')
const fetch = require('node-fetch');
const user = process.env.USERNAME + ':' + process.env.API_KEY.toString();
const baseUrl = process.env.URL;

const createWebhook = async (jql, subscriptionId) => {
  var fetchUrl = baseUrl + '/rest/webhooks/1.0/webhook/';
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
    "excludeIssueDetails": false
  }`;
  return fetch(fetchUrl, {
    method: 'post',
    headers: {
      'Authorization': `Basic ${Buffer.from(user).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyData
  }).then(response => { 
    return response.json() })
  .then(text => {
    text = text.self;
    const webhookId = text.split("/").pop();
    return webhookId;
  }).catch(err => console.error(err));
}

const deleteWebhook = async (webhookId) => {
  var fetchUrl = baseUrl + '/rest/webhooks/1.0/webhook/' + webhookId;
  return fetch(fetchUrl, {
    method: 'delete',
    headers: {
      'Authorization': `Basic ${Buffer.from(user).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(response => { 
    return response.text() })
  .then(text => console.log(text))
  .catch(err => console.error(err));
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
  convertIssueToPrimitives
}