export const deleteSubitemsConstants = {
  deleteSubitemQuery: `mutation ($item_id: Int!) {
        delete_item(item_id: $item_id) {
          board {
            items {
              name
              id
            }
          }
        }
      }
      `,
  deleteSubitemInstructionsListItems: [
    "Get the subitems from the board",
    "Get the subitem ID",
    "Use the mutation to delete subitem",
  ],
  deleteSubitemInstructionslinkToDocumentation: "https://api.developer.monday.com/docs/items-queries",
  githubUrl: "DeleteSubitem/DeleteSubitem.jsx",
};
