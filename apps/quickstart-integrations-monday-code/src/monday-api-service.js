import initMondayClient from "monday-sdk-js";
import { Logger } from "@mondaycom/apps-sdk";

const logTag = "Middleware";
const logger = new Logger(logTag);

export const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setApiVersion('2024-01');
    mondayClient.setToken(token);

    logger.info('about to get column value');
    const query = `query($itemId: [ID!], $columnId: [String!]) {
          items (ids: $itemId) {
            column_values(ids:$columnId) {
              value
            }
          }
        }`;
    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    logger.info(`received column value: ${JSON.stringify(response)}`);
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    logger.error(err);
  }
};

export const changeColumnValue = async (
  token,
  boardId,
  itemId,
  columnId,
  value
) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion('2024-01');

    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
          change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
            id
          }
        }
        `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    logger.error(err);
  }
};
