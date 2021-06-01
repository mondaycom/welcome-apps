const jiraService = require('../services/jira-service');
const subscriptionModelService = require('../services/model-services/subscription-model-service');
const mondayService = require('../services/monday-service');

async function subscribe(req, res) {
  const { payload } = req.body;
  const { webhookUrl, inputFields } = payload;
  const { shortLivedToken } = req.session;
  try {
    const jql = inputFields.jql;
    const boardId = inputFields.boardId;
    var columnId = "";
    const { id: subscriptionId } = await subscriptionModelService.createSubscription({ mondayWebhookUrl: webhookUrl });
    const webhookId = await jiraService.createWebhook(jql, subscriptionId);
    const columnList = await mondayService.queryColumns(shortLivedToken, boardId)
    columnList.forEach(column => { if (column.id.search("jira_issue") != -1) { columnId = column.id }})
    await subscriptionModelService.updateSubscription(subscriptionId, { webhookId });
    return res.status(200).send({ webhookId: subscriptionId });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
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

async function getItemsByIssueId(itemList, issueId) {
  var itemArray = [];
  try{
    for (var item of itemList){
      var issue = item.column_values[0].value;
      if (issue != null) {
        issue = JSON.parse(issue)
        if (issue.entity_id == issueId)  {
          itemArray.push(item)
        }
      }
    }
    return itemArray;
  }catch (err){
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

async function executeAction(req, res) {
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { issueId, boardId, itemMapping } = inboundFieldValues; 
  const { name } = itemMapping;

  delete itemMapping["__groupId__"];
  var columnId = "";
  const columnList = await mondayService.queryColumns(shortLivedToken, boardId);
  columnList.forEach(column => { if (column.id.search("jira_issue") != -1) { columnId = column.id }})
  if (columnId == "") { columnId = await mondayService.createColumn(shortLivedToken, boardId) }

  try {
    const jiraIssueId = { [columnId]: { "entity_id": issueId } };
    Object.assign(itemMapping, jiraIssueId)
    const columnValues = JSON.stringify(itemMapping)
    const itemList = await mondayService.queryItemValues(shortLivedToken, boardId, columnId)
    var foundItem = await getItemsByIssueId(itemList, issueId); 
    if (foundItem.length == 0){ await mondayService.createItem(shortLivedToken, boardId, name, columnValues) }
    else{ 
      var itemId = foundItem[0].id;
      await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues) }
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
