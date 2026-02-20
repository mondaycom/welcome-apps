export const getAllBoardItemsQuery = `query ($boardIds: [ID!], $limit: Int) {
  boards(ids: $boardIds, limit: $limit) {
    name
    items_page(limit: $limit) {
      items {
        id
        name
      }
    }
  }
}`;

export const getRelevantItems = `query ($itemIds: [ID]) {
  items(ids: $itemIds) {
    id
    name
    board {
      id
      name
    }
  }
}
`;

export const GET_ALL_BOARD_ITEMS_QUERY_LIMIT = 50;
export const ITEMS_BACKGROUND_COLORS = [
  "(236,53,127)",
  "(112,194,251)",
  "(248,198,49)",
  "(188,188,188)",
  "(166,56,76)",
  "(72,189,110)",
  "(89,143,246)",
  "(144,86,210)",
  "(44,113,69)",
];
