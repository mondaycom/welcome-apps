const fetch = require('node-fetch');
const initMondayClient = require('monday-sdk-js');

const triggerMondayIntegration = async (webhookUrl, data = {}) => {
  fetch(webhookUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.MONDAY_SIGNING_SECRET,
    },
    body: JSON.stringify({
      trigger: {
        outputFields: {
          ...data,
        },
      },
    }),
  });
};

const queryColumns = async (token, boardId) => {
  const mondayClient = initMondayClient({ token });
  const query = `query queryBoards($boardId: [Int]) { boards(ids: $boardId) { columns { id } } }`;
  const variables = { boardId };
  var response = await mondayClient.api(query, { variables });
  response = response.data.boards[0].columns;
  const columnArray = []; 
  response.forEach(column => {
    columnArray.push(column)
  });
  return columnArray;
}

const queryItemValues = async(token, boardId, columnId) => {
  const mondayClient = initMondayClient({ token });
  const query = `query queryItemValues($boardId: [Int], $columnId: [String]) { boards(ids: $boardId) { items { id, column_values(ids: $columnId) { value }}}}`;
  const variables = { boardId, columnId };
  var response = await mondayClient.api(query, { variables });
  response = response.data.boards[0].items;
  const itemArray = []; 
  response.forEach(item => {
    itemArray.push(item)
  });
  return itemArray;
}

const createColumn = async (token, boardId) => {
  const mondayClient = initMondayClient({ token });
  const query = `mutation create_column($boardId: Int!) { create_column(board_id: $boardId, title: \"Jira Issue Id\", column_type: integration) { id } }`;
  const variables = { boardId };
  const response = await mondayClient.api(query, { variables });
  return response;
}

const createItem = async (token, boardId, itemName, columnValues) => {
  const mondayClient = initMondayClient({ token });
  const query = `mutation create_item($boardId: Int!, $itemName: String, $columnValues: JSON) { create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
  const variables = { boardId, itemName, columnValues };
  const response = await mondayClient.api(query, { variables });
  return response;
}

const changeMultipleColumnValues = async (token, boardId, itemId, columnValues) => {
  itemId = Number(itemId);
  const mondayClient = initMondayClient({ token });
  const query = `mutation change_multiple_column_values($boardId: Int!, $itemId: Int!, $columnValues: JSON!) { change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
  const variables = { boardId, itemId, columnValues };
  const response = await mondayClient.api(query, { variables });
  return response;
}

module.exports = {
  triggerMondayIntegration,
  queryColumns,
  queryItemValues,
  createColumn,
  createItem,
  changeMultipleColumnValues
};
