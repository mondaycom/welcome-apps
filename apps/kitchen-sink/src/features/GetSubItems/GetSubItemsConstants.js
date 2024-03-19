const getSubItemsConstants = {
  dropdownPlaceholder: "Board Items",
  getAllColumnsQuery: `query ($boardIds: [Int]) {
    boards(ids: $boardIds) {
      columns {
      type
      settings_str
      }
    }
  }`,
  getSubitemsBoardIdQuery: `query ($boardIds: [Int]) {
    boards(ids: $boardIds) {
      columns(ids: "subitems") {
        settings_str
      }
    }
  }`,
  getAllSubItemsIdsOfAnItemQuery: `query ($boardIds: [Int!], $itemIds: [Int!]) {
    boards(ids: $boardIds) {
      items(ids: $itemIds) {
        id
        column_values {
          value
          type
        }
      }
    }
  }  
  `,
  getAllSubItemsQuery: `query ($boardIds: [Int!], $subitemsIds: [Int!]) {
    boards(ids: $boardIds) {
      items(ids: $subitemsIds) {
        id
        name
      }
    }
  }    
  `,
  getSubItemsInstructionsParagraphs: [
    `Subitems are special items that are "nested" under the items on your board. They can be accessed via the subitem
    column which can be added either from the columns center, or by right-clicking an item to expose its dropdown
    menu.`,
    `All subitems are stored on an entirely separate board from their parent items. The subitems column on the parent
    board contains the IDs of the subitems linked to a given item. As such, in order to find your subitem board ID,
    you will first need to query the column_values() of the parent board's subitem column. This will return your
    subitem IDs which you can then use to query the boards field to find your subitem board ID.`,
  ],
  getSubItemsInstructionslinkToDocumentation: `https://api.developer.monday.com/docs/subitems`,
  getSubItemsInstructionsListItems: [
    `Get the subitems board id.`,
    `Get the subitems ids of an item.`,
    `Fetch the subitems data from the subitems board id by the subitems ids.`,
  ],
  githubUrl: "GetSubitems/GetSubitems.jsx",
};

export default getSubItemsConstants;
