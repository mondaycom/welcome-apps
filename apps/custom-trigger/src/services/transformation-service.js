class TransformationService {
  static async transformText(value, type) {
    switch (type) {
      case 'TO_UPPER_CASE':
        return value.toUpperCase();
      case 'TO_LOWER_CASE':
        return value.toLowerCase();
      default:
        return value.toUpperCase();
    }

  }

  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = TransformationService;
