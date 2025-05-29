const jiraService = require('../services/jira-service');
const subscriptionModelService = require('../services/model-services/subscription-model-service');
const mondayService = require('../services/monday-service');

/**
 * Handles subscription requests from Monday.com, creates & stores a subscription, creates a JIRA webhook, ensures the integration column exists, and responds with the webhook ID.
 * 
 * @param {Object} req - The Express request object, containing the payload and session.
 * @param {Object} res - The Express response object, used to send the response.
 */
async function subscribe(req, res) {
  const { payload } = req.body;
  const { webhookUrl, inputFields, subscriptionId } = payload;
  const { shortLivedToken } = req.session;
  const { jql, boardId } = inputFields;
  try {
    const subscription = await subscriptionModelService.createSubscription({ mondayWebhookUrl: webhookUrl, subscriptionId }, shortLivedToken);
    if (!subscription.success) {
      throw Error('Subscription could not be set in Storage');
    }
    const webhookId = await jiraService.createWebhook(jql, subscriptionId);
    await findOrCreateColumn(shortLivedToken, boardId)
    await subscriptionModelService.updateSubscription(subscriptionId, { webhookId }, shortLivedToken);
    console.log({msg: 'Subscribed successfully.', subscriptionId, webhookUrl, boardId})
    return res.status(200).send({ webhookId: subscriptionId });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Finds an existing integration column on a Monday.com board or creates one if it does not exist.
 * 
 * @param {string} shortLivedToken - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to search or create the column in.
 * @returns {Promise<string>} - The ID of the integration column.
 */
async function findOrCreateColumn(shortLivedToken, boardId){
  try{
    var columnId;
    const columnList = await mondayService.queryColumns(shortLivedToken, boardId)
    columnList.forEach(column => { if (column.type.search("integration") !== -1) { columnId = column.id }})
    if (columnId) {
      return columnId;
    } else {
      console.log({msg: `No integration column found. Creating column`, boardId})
      const createColumn = await mondayService.createColumn(shortLivedToken, boardId);
      return createColumn.data.create_column.id;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

/**
 * Handles unsubscribe requests, deletes the webhook, deletes the subscription from storage, and responds with a success message.
 * 
 * @param {Object} req - The Express request object, containing the payload.
 * @param {Object} res - The Express response object, used to send the response.
 */
async function unsubscribe(req, res) {
  const { webhookId: subscriptionId } = req.body.payload;
  const { shortLivedToken } = req.session;
  try {
    const { webhookId } = await subscriptionModelService.getSubscription(subscriptionId, shortLivedToken);
    await jiraService.deleteWebhook(webhookId);
    await subscriptionModelService.deleteSubscription(subscriptionId, shortLivedToken);
    console.log({ msg: 'unsubscribed successfully', subscriptionId })
    return res.status(200).send({ result: 'unsubscribed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Retrieves Jira issue field definitions and sends them in the response.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object, used to send the response.
 */
async function getFieldDefs(req, res) {
  try {
    const fieldDefs = jiraService.getIssueFieldDefs();
    return res.status(200).send(fieldDefs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Finds a Monday.com item by Jira issue ID or creates it if it does not exist; updates column values if found.
 * 
 * @param {string} shortLivedToken - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to search or create the item in.
 * @param {string} columnId - The ID of the integration column.
 * @param {string|number} issueId - The Jira issue ID to match.
 * @param {string} name - The name for the new item if it needs to be created.
 * @param {Object} columnValues - The column values to set for the item.
 */
async function getItemByIssueOrCreateIfNotExists(shortLivedToken, boardId, columnId, issueId, name, columnValues) {
  try {
    const itemList = await mondayService.queryItemValues(shortLivedToken, boardId, columnId)
    const itemArray = itemList.filter(item => (item?.column_values[0]?.value && JSON.parse(item.column_values[0].value).entity_id === issueId))
    if (itemArray.length === 0){ await mondayService.createItem(shortLivedToken, boardId, name, columnValues) } 
    else { 
      const itemId = itemArray[0].id;
      await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues) 
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Handles action execution requests from monday.com. Checks if the integration column exists, then creates an item or updates an existing one.
 * 
 * @param {Object} req - The Express request object, containing the payload and session.
 * @param {Object} res - The Express response object, used to send the response.
 */
async function executeAction(req, res) {
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { issueId, boardId, itemMapping } = inboundFieldValues; 
  const { name } = itemMapping;
  console.log({msg: 'Executing action', boardId, issueId})
  try {
    const columnId = await findOrCreateColumn(shortLivedToken, boardId);
    const columnValues = {...itemMapping, [columnId]: { "entity_id": issueId }};
    await getItemByIssueOrCreateIfNotExists(shortLivedToken, boardId, columnId, issueId, name, columnValues);
    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  getFieldDefs,
  executeAction
};
