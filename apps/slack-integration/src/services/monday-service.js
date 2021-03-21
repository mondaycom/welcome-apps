const initMondayClient = require('monday-sdk-js');

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            additional_info
          }
        }
      }`;
    const variables = {columnId, itemId};

    const response = await mondayClient.api(query, {variables});
    const {label} = JSON.parse(response.data.items[0].column_values[0].additional_info);
    return label
  } catch (err) {
    console.log(err);
  }
};

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `mutation change_simple_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: String!) {
        change_simple_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = {boardId, columnId, itemId, value};

    return await mondayClient.api(query, {variables});
  } catch (err) {
    console.log(err);
  }
};

const createItemColumnValues = (text, groupId) => ({columnValues: {name: text}, groupId});

module.exports = {
  changeColumnValue,
  getColumnValue,
  createItemColumnValues
};
