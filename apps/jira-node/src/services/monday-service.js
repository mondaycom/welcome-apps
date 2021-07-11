const fetch = require('node-fetch');
const initMondayClient = require('monday-sdk-js');

const triggerMondayIntegration = async (webhookUrl, data = {}) => {
  fetch(webhookUrl, {
    method: 'POST',
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
  try {
    const mondayClient = initMondayClient({ token });
    const query = `query queryBoards($boardId: [Int]) { boards(ids: $boardId) { columns { id } } }`;
    const variables = { boardId };
    const response = await mondayClient.api(query, { variables });
    return response?.data?.boards[0]?.columns;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

const queryItemValues = async(token, boardId, columnId) => {
  try {
    const mondayClient = initMondayClient({ token });
    const query = `query queryColumnValues($boardId: [Int], $columnId: [String]) { boards(ids: $boardId) { items { id, column_values(ids: $columnId) { value }}}}`;
    const variables = { boardId, columnId };
    const response = await mondayClient.api(query, { variables });
    return response?.data?.boards[0]?.items;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

const createColumn = async (token, boardId) => {
  try {
    const mondayClient = initMondayClient({ token });
    const query = `mutation create_column($boardId: Int!) { create_column(board_id: $boardId, title: \"Jira Issue Id\", column_type: integration) { id } }`;
    const variables = { boardId };
    return await mondayClient.api(query, { variables });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

const createItem = async (token, boardId, itemName, columnValues) => {
  try {
    const mondayClient = initMondayClient({ token });
    const groupId = columnValues.__groupId__;
    columnValues = JSON.stringify(columnValues)
    const query = `mutation create_item($boardId: Int!, $itemName: String, $groupId: String, $columnValues: JSON) { create_item (board_id: $boardId, item_name: $itemName, group_id: $groupId, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
    const variables = { boardId, itemName, groupId, columnValues };
    return await mondayClient.api(query, { variables });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

const changeMultipleColumnValues = async (token, boardId, itemId, columnValues) => {
  try {
    itemId = Number(itemId);
    delete columnValues["__groupId__"];
    columnValues = JSON.stringify(columnValues)
    const mondayClient = initMondayClient({ token });
    const query = `mutation change_multiple_column_values($boardId: Int!, $itemId: Int!, $columnValues: JSON!) { change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
    const variables = { boardId, itemId, columnValues };
    return await mondayClient.api(query, { variables });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

module.exports = {
  triggerMondayIntegration,
  queryColumns,
  queryItemValues,
  createColumn,
  createItem,
  changeMultipleColumnValues
};
