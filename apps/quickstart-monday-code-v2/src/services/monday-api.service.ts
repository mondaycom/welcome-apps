import { Logger } from "@mondaycom/apps-sdk";
import initMondayClient from "monday-sdk-js";

const logger = new Logger("MondayApiService");

export const platformApiHealthCheck = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    const query = `query { me { account { id } } }`;
    await mondayClient.api(query, {});
    return { success: true };
  } catch (err) {
    logger.error("Platform API health check failed", { error: err instanceof Error ? err : new Error(String(err)) });
    return { success: false, error: (err as Error).message };
  }
};

export const getColumnValue = async (token: string, itemId: string, columnId: string): Promise<string | undefined> => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setApiVersion("2024-01");
    mondayClient.setToken(token);

    const query = `query($itemId: [ID!], $columnId: [String!]) {
      items (ids: $itemId) {
        column_values(ids:$columnId) {
          value
        }
      }
    }`;
    const variables = { columnId, itemId };
    const response = await mondayClient.api(query, { variables });
    const data = response.data as { items: Array<{ column_values: Array<{ value: string }> }> };
    return data.items[0].column_values[0].value;
  } catch (err) {
    logger.error("getColumnValue failed", { error: err instanceof Error ? err : new Error(String(err)) });
  }
};

export const changeColumnValue = async (token: string, boardId: string, itemId: string, columnId: string, value: string): Promise<unknown> => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion("2024-01");

    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
        id
      }
    }`;
    const variables = { boardId, columnId, itemId, value };
    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    logger.error("changeColumnValue failed", { error: err instanceof Error ? err : new Error(String(err)) });
  }
};

interface BoardColumn {
  id: string;
  title: string;
  type: string;
}

export const getBoardColumns = async (token: string, boardId: string): Promise<BoardColumn[]> => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setApiVersion("2024-01");
    mondayClient.setToken(token);

    const query = `query($boardId: [ID!]) {
      boards(ids: $boardId) {
        columns {
          id
          title
          type
        }
      }
    }`;
    const variables = { boardId };
    const response = await mondayClient.api(query, { variables });
    const data = response.data as { boards: Array<{ columns: BoardColumn[] }> };

    if (data && data.boards && data.boards[0]) {
      return data.boards[0].columns;
    }
    return [];
  } catch (err) {
    logger.error(`Error fetching board columns for board ${boardId}: ${(err as Error).message}`);
    return [];
  }
};
