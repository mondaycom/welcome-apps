const initMondayClient = require('monday-sdk-js');
const LoggerService = require('./monday-code/logger-service');

class MondayService {
  static async getItemTitle(token, itemId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);
      mondayClient.setApiVersion('2024-01');

      const query = `query($itemId: [ID!]) {
        items (ids: $itemId) {
          name
        }
      }`;
      const variables = { itemId };

      const response = await mondayClient.api(query, { variables });
      return response.data.items[0].name;
    } catch (err) {
      LoggerService.getInstance().error('Error getting item title', err);
      return null;
    }
  }

  static async getStatusColumn(token, boardId, itemId, columnId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);
      mondayClient.setApiVersion('2024-01');

      const query = `query($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
            type
          }
        }
      }`;
      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });
      const columnData = response.data.items[0].column_values[0];

      const statusColumnSettings = await this.getStatusColumnSettings(token, boardId, columnId);

      if (statusColumnSettings) {
        return {
          type: 'status',
          value: statusColumnSettings.labels[JSON.parse(columnData.value).index],
        };
      }
      return null;
    } catch (err) {
      LoggerService.getInstance().error('Error getting status column', err);
    }
  }

  static async getStatusColumnSettings(token, boardId, columnId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);
      mondayClient.setApiVersion('2024-01');

      const query = `query($boardId: [ID!], $columnId: String!) {
        boards (ids: $boardId) {
          columns (ids: [$columnId]) {
            id
            type
            settings_str
          }
        }
      }`;

      const variables = { boardId, columnId };
      const response = await mondayClient.api(query, { variables });

      const column = response.data.boards[0].columns[0];

      const settings = JSON.parse(column.settings_str);
      return settings;
    } catch (err) {
      LoggerService.getInstance().error('Error getting status column settings', err);
      return null;
    }
  }
}

module.exports = MondayService;
