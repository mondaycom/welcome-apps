export const UpdateSubitemsConstants = {
  updateSubitemName: `mutation ($board_id: Int!, $item_id: Int!, $column_values: JSON!) {
    change_multiple_column_values(item_id: $item_id, board_id: $board_id, column_values: $column_values) {
      board {
        id
        items {
          id
          name
        }
      }
    }
  }
`,
  updateSubitemInstructionsListItems: [
    "Get the subitems from the board",
    "Get the subitem ID",
    "Use the mutation to update the columns in the subitem",
  ],
  updateSubitemInstructionslinkToDocumentation: "https://api.developer.monday.com/docs/subitems",
  githubUrl: "UpdateSubitems/UpdateSubitems.jsx",
};
