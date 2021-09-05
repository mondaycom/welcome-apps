export const getUpdatesConstants = {
  getUpdatesQuery: `query ($board_id: Int!, $item_id: Int!) {
        boards(ids: [$board_id]) {
          items(ids: [$item_id]) {
            updates {
              id
              text_body
              body
              creator {
                id
                name
              }
            }
          }
        }
      }`,
  getUpdatesInstructionsParagraphs: [
    `monday.com updates contain additional notes and information added to items outside of their columns.
    The main form of communication within the platform takes place in the updates section.`,
  ],
  getUpdatesInstructionslinkToDocumentation: `https://api.developer.monday.com/docs/updates-queries`,
  getUpdatesInstructionsListItems: [
    `Get the board ID.`,
    `Get the item ID.`,
    `Fetch the updates data using item ID and board ID .`,
  ],
  githubUrl: "GetUpdates/GetUpdates.jsx",
};
