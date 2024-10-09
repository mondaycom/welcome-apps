const deleteItemConstants = {
  deleteItemAndGetUpdatedBoardItemsQuery: `mutation ($itemId: Int!) {
    delete_item(item_id: $itemId) {
      board {
        items {
          id
          name
        }
      }
    }
  }
  `,
  deleteItemInstructionsParagraphs: [
    `This mutation allows you to delete a single item. After the mutation runs you can query back the remaining items data as shown in the querying items section above.`,
  ],
  deleteItemInstructionslinkToDocumentation: `https://api.developer.monday.com/docs/items-queries`,
  deleteItemInstructionsListItems: [`Send mutation query with the item id.`],
  githubUrl: "DeleteItem/DeleteItem.jsx",
};

export default deleteItemConstants;
