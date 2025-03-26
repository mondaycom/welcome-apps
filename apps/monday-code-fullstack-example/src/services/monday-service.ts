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

const createWebhookOnBoardAuthed = async (
  boardId: string,
  event: string,
  url: string,
  token: string,
  config?: any
) => {
  try {
    var query = '';

    if (config) {
      query = `mutation ($boardId: ID!, $event: WebhookEventType!, $url: String!, $config: JSON!) {
            create_webhook (board_id: $boardId, url: $url, event: $event config: $config) {
              id
              board_id
            }
          }`;
    } else {
      query = `mutation ($boardId: ID!, $event: WebhookEventType!, $url: String!) {
            create_webhook (board_id: $boardId, event: $event, url: $url) {
              id
              board_id
            }
          }`;
    }

    const variables = config
      ? { boardId, event, url, config: JSON.stringify(config) }
      : { boardId, event, url };
    const response = await graphQLQueryManager(token, query, variables);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export { getColumnValue, changeColumnValue, createWebhookOnBoardAuthed };
