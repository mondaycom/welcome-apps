const deleteItemConstants = {
  deleteItemAndGetUpdatedBoardItemsQuery: `mutation ($itemId: ID!) {
    delete_item(item_id: $itemId) {
      board {
        items_page {
          items {
            id
            name
          }
        }
      }
    }
  }
  `,
  deleteItemInstructionsParagraphs: [
    `The 'delete_item' mutation allows you to delete a single item, based on its board ID and item ID`,
    `Caution: this example will really delete the selected item from your board!`,
  ],
  deleteItemInstructionslinkToDocumentation: `https://developer.monday.com/api-reference/reference/items#delete-an-item`,
  deleteItemInstructionsListItems: [
    `Select an item to delete.`,
    `The app sends the mutation query with the item ID.`,
  ],
  githubUrl: "DeleteItem/DeleteItem.jsx",
};

export default deleteItemConstants;
