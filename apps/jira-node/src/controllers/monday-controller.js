const jiraService = require('../services/jira-service');
const subscriptionModelService = require('../services/model-services/subscription-model-service');
const mondayService = require('../services/monday-service');

async function subscribe(req, res) {
  const { payload } = req.body;
  const { webhookUrl, inputFields } = payload;
  const { shortLivedToken } = req.session;
  const { jql, boardId } = inputFields;
  try {
    const { id: subscriptionId } = await subscriptionModelService.createSubscription({ mondayWebhookUrl: webhookUrl });
    const webhookId = await jiraService.createWebhook(jql, subscriptionId);
    await findOrCreateColumn(shortLivedToken, boardId)
    await subscriptionModelService.updateSubscription(subscriptionId, { webhookId });
    return res.status(200).send({ webhookId: subscriptionId });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function findOrCreateColumn(shortLivedToken, boardId){
  try{
    var columnId;
    const columnList = await mondayService.queryColumns(shortLivedToken, boardId)
    columnList.forEach(column => { if (column.id.search("jira_issue") !== -1) { columnId = column.id }})
    return columnId ?? columnId === await mondayService.createColumn(shortLivedToken, boardId);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

async function unsubscribe(req, res) {
  const { webhookId: subscriptionId } = req.body.payload;
  try {
    const { webhookId } = await subscriptionModelService.getSubscription(subscriptionId);
    await jiraService.deleteWebhook(webhookId);
    await subscriptionModelService.deleteSubscription(subscriptionId);
    return res.status(200).send({ result: 'unsubscribed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function getFieldDefs(req, res) {
  try {
    const fieldDefs = jiraService.getIssueFieldDefs();
    return res.status(200).send(fieldDefs);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

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

async function executeAction(req, res) {
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { issueId, boardId, itemMapping } = inboundFieldValues; 
  const { name } = itemMapping;
  const columnId = await findOrCreateColumn(shortLivedToken, boardId);
  try {
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
