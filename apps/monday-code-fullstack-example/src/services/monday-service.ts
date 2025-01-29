import initMondayClient from 'monday-sdk-js';
import { graphQLQueryManager } from '../utils/graphql-query-manager';

interface GetColumnValueResponse {
  items: Array<{
    column_values: Array<{
      value: string;
    }>;
  }>;
}

const getColumnValue = async (
  token: string,
  itemId: string,
  columnId: string
): Promise<string | undefined> => {
  try {
    const query = `query($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
    const variables = { columnId, itemId };

    const response: GetColumnValueResponse = await graphQLQueryManager(
      token,
      query,
      variables
    );
    return response.items[0].column_values[0].value;
  } catch (err) {
    throw new Error(err);
  }
};

interface ChangeColumnValueResponse {
  change_column_value: {
    id: string;
  };
}

const changeColumnValue = async (
  token: string,
  boardId: string,
  itemId: string,
  columnId: string,
  value: any
): Promise<ChangeColumnValueResponse | undefined> => {
  try {
    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response: ChangeColumnValueResponse = await graphQLQueryManager(
      token,
      query,
      variables
    );

    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export { getColumnValue, changeColumnValue };
