const { Octokit } = require('@octokit/rest');
const { ISSUE_FIELD_DEFS } = require('../constants/github');
const { cache, cacheKeys } = require('../services/cache-service');

/**
 * Creates a webhook in Github.
 */
const createWebhook = async (token, owner, repo, subscriptionId, events) => {
  const octokit = new Octokit({ auth: token });

  const targetUrl = `${cache.get(cacheKeys.SERVER_URL)}/integration/integration-events/${subscriptionId}/`;
  const response = await octokit.repos.createHook({
    owner,
    repo,
    name: 'web',
    active: true,
    events,
    config: {
      url: targetUrl,
      content_type: 'json',
    },
  });

  const webhookId = response.data.id;
  if (!webhookId) {
    throw new Error('was not able to create new webhook');
  }

  return webhookId;
};

/**
 * Deletes a webhook in Github.
 */
const deleteWebhook = async (token, owner, repo, webhookId) => {
  const octokit = new Octokit({ auth: token });
  await octokit.repos.deleteHook({ owner, repo, hook_id: webhookId });
};

/**
 * Gets a list of repositories in Github.
 */
const getRepositories = async (token) => {
  const octokit = new Octokit({ auth: token });

  const reposResponse = await octokit.repos.list({ visibility: 'private', sort: 'created' });
  const repos = reposResponse ? reposResponse.data : [];

  const options = repos.map((repo) => {
    const value = {
      uniqueId: repo.id,
      owner: repo.owner.login,
      name: repo.name,
      full_name: repo.full_name,
      ownerType: repo.owner.type,
    };
    return { value, title: repo.name };
  });

  return options;
};

/**
 * Docs: https://developer.monday.com/apps/docs/dynamic-mapping#field-definitions-url
 * @returns A list of fields supported on the "Github issue" object. 
 */
const getIssueFieldDefs = () => {
  return ISSUE_FIELD_DEFS;
};

/**
 * Converts the incoming issue to mappable fields in monday. 
 */
const convertIssueToPrimitives = (issue) => {
  return {
    title: issue.title,
    state: issue.state,
    url: issue.url,
    repository_url: issue.repository_url,
    labels_url: issue.labels_url,
    labels: issue.labels ? issue.labels.map((label) => label.name) : [],
    comments_url: issue.comments_url,
    events_url: issue.events_url,
    html_url: issue.html_url,
    number: issue.number,
    locked: issue.locked,
    assignee: issue.assignee ? issue.assignee.login : '',
    assignees: issue.assignees ? issue.assignees.map((assignee) => assignee.login) : [],
    milestone: issue.milestone ? issue.milestone.title : '',
    comments: issue.comments,
    body: issue.body,
    id: issue.id,
  };
};

/**
 * Creates a new issue in Github.
 */
const createIssue = async (token, owner, repo, issue) => {
  const octokit = new Octokit({ auth: token });
  return await octokit.issues.create({
    owner,
    repo,
    ...issue,
    title: issue.title || 'New Issue',
  });
};

module.exports = {
  createWebhook,
  deleteWebhook,
  getRepositories,
  getIssueFieldDefs,
  convertIssueToPrimitives,
  createIssue,
};
