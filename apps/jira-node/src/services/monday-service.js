const fetch = require('node-fetch');
const initMondayClient = require('monday-sdk-js');
const {getSecret} = require('../helpers/secret-store');
const {MONDAY_SIGNING_SECRET} = require('../constants/secret-keys')

/**
 * Triggers a Monday.com integration by sending a POST request to the specified webhook URL.
 * 
 * @param {string} webhookUrl - The URL of the Monday.com webhook to trigger.
 * @param {Object} [data={}] - Optional data to include in the trigger payload.
 * @description Sends a POST request to a Monday.com webhook with the provided data.
 * @apiusage This function does not call the Monday API directly; it sends a webhook.
 */
const triggerMondayIntegration = async (webhookUrl, data = {}) => {
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSecret(MONDAY_SIGNING_SECRET),
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

/**
 * Queries the columns of a specific Monday.com board. This function calls the Monday API via mondayClient.api.
 * 
 * @description Fetches the columns of a given board using the Monday.com API.
 * @param {string} token - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to query columns from.
 * @returns {Promise<Array>} - A promise that resolves to an array of column objects ({ id, type }).
 */
const queryColumns = async (token, boardId) => {
  try {
    const mondayClient = initMondayClient({ token });

    const query = `query queryBoards($boardId: [ID!]) { boards(ids: $boardId) { columns { id type } } }`;
    const variables = { boardId };
    const response = await mondayClient.api(query, { apiVersion: "2025-01", variables });
    console.log({queryColumns: JSON.stringify(response)})
    return response?.data?.boards[0]?.columns;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Queries the values of a specific column for all items on a Monday.com board.
 * 
 * @param {string} token - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to query.
 * @param {string} columnId - The ID of the column to fetch values for.
 * @returns {Promise<Array>} - A promise that resolves to an array of items with their column values.
 * @description Fetches the values of a specific column for all items on a board using the Monday.com API.
 * @apiusage Yes, this function calls the Monday API via mondayClient.api.
 */
const queryItemValues = async(token, boardId, columnId) => {
  try {
    const mondayClient = initMondayClient({ token });
    const query = `query queryColumnValues($boardId: [ID!], $columnId: [String!]) { boards(ids: $boardId) { items_page (limit:100) { items { id, column_values(ids: $columnId) { value }}}}}`;
    const variables = { boardId, columnId };
    const response = await mondayClient.api(query, { apiVersion: "2025-01", variables });
    console.log(JSON.stringify({response, variables}))
    return response?.data?.boards[0]?.items_page?.items;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

/**
 * Creates a new column of type "integration" on a Monday.com board.
 * 
 * @param {string} token - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to add the column to.
 * @returns {Promise<Object>} - A promise that resolves to the API response containing the new column's ID.
 * @description Adds a new integration column titled "Jira Issue Id" to the specified board using the Monday.com API.
 * @apiusage Yes, this function calls the Monday API via mondayClient.api.
 */
const createColumn = async (token, boardId) => {
  try {
    const mondayClient = initMondayClient({ token });
    const query = `mutation create_column($boardId: ID!) { create_column(board_id: $boardId, title: \"Jira Issue Id\", column_type: integration) { id } }`;
    const variables = { boardId };
    return await mondayClient.api(query, { apiVersion: "2025-01", variables });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'internal server error'})
  }
}

/**
 * Creates a new item on a Monday.com board with specified column values.
 * 
 * @param {string} token - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board to add the item to.
 * @param {string} itemName - The name of the new item.
 * @param {Object} columnValues - The column values for the new item (must include __groupId__).
 * @returns {Promise<Object>} - A promise that resolves to the API response containing the new item's ID.
 * @description Creates a new item in a specified group on a board with given column values using the Monday.com API.
 * @apiusage Yes, this function calls the Monday API via mondayClient.api.
 */
const createItem = async (token, boardId, itemName, columnValues) => {
  try {
    const mondayClient = initMondayClient({ token });
    console.log({msg: 'creating item', boardId, itemName, columnValues: JSON.stringify(columnValues)})
    const groupId = columnValues.__groupId__;
    columnValues = JSON.stringify(columnValues)
    const query = `mutation create_item($boardId: ID!, $itemName: String!, $groupId: String!, $columnValues: JSON!) { create_item (board_id: $boardId, item_name: $itemName, group_id: $groupId, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
    const variables = { boardId, itemName, groupId, columnValues };
    const response = await mondayClient.api(query, { apiVersion: "2025-01", variables });
    console.log({msg: 'created item via API', response: JSON.stringify(response)});
    return response;
  } catch (err) {
    console.log({msg: 'Error creating item', data: { boardId, columnValues }, err});
    return res.status(500).send({ message: 'internal server error'})
  }
}

/**
 * Changes multiple column values for a specific item on a Monday.com board.
 * 
 * @param {string} token - The Monday.com API token.
 * @param {string|number} boardId - The ID of the board containing the item.
 * @param {string|number} itemId - The ID of the item to update.
 * @param {Object} columnValues - The new column values to set for the item.
 * @returns {Promise<Object>} - A promise that resolves to the API response containing the updated item's ID.
 * @description Updates multiple column values for a given item on a board using the Monday.com API.
 * @apiusage Yes, this function calls the Monday API via mondayClient.api.
 */
const changeMultipleColumnValues = async (token, boardId, itemId, columnValues) => {
  try {
    itemId = Number(itemId);
    delete columnValues["__groupId__"];
    columnValues = JSON.stringify(columnValues)
    const mondayClient = initMondayClient({ token });
    
    const query = `mutation change_multiple_column_values($boardId: ID!, $itemId: ID!, $columnValues: JSON!) { change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues, create_labels_if_missing: true) { id } }`;
    const variables = { boardId, itemId, columnValues };
    return await mondayClient.api(query, { apiVersion: "2025-01", variables });
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
