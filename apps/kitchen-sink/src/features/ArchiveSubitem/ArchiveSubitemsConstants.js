export const archiveSubitemsConstants = {
  archiveSubitemQuery: `mutation ($item_id: Int!) {
        archive_item(item_id: $item_id) {
          board {
            items {
              name
              id
            }
          }
        }
      }
`,
  archiveSubitemInstructionsListItems: [
    "Get the subitems from the board",
    "Get the subitem ID",
    "Use the mutation to archive subitem",
  ],
  archiveSubitemInstructionslinkToDocumentation: "https://api.developer.monday.com/docs/items-queries",
  githubUrl: "ArchiveSubitem/ArchiveSubitem.jsx",
};
