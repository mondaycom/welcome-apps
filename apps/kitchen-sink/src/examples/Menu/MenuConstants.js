export const ROUTES = {
  MENU: "menu",
  GET_SUB_ITEMS: "getSubItems",
  DELETE_ITEM: "deleteItem",
  OPEN_ITEM_CARD: "openItemCard",
  UPLOAD_FILE_VIA_SDK: "uploadFileViaSdk",
  UPLOAD_FILE_VIA_API: "uploadFileViaApi",
  STORAGE_API: "storageApi",
  WORKING_WITH_SETTINGS: "workingWithSettings",
  CONFIRMATION: "confirmation",
  NOTICE: "notice",
  FILEPREVIEW: "filepreview",
  PAGINATED: "paginated",
  UPDATE_SUBITEM: "update_subitem",
  ARCHIVE_SUBITEM: "archive_subitem",
  DELETE_SUBITEM: "delete_subitem",
  UPDATES: "updates",
  TAB_LAYOUT_TEST: "tab_layout",
  OPEN_SETTINGS_PANE: "open_settings_pane",
  CREATE_ITEM: "create_item",
  GET_APP_CONTEXT: "get_app_context",
  LISTEN_TO_EVENTS: "listen_to_events",
  LISTEN_TO_BOARD_FILTER: "listen_to_board_filter",
  GET_BOARD_ITEMS: "get_board_items",
  GET_WORKSPACES: "get_workspaces",
};

const BACKGROUND_COLORS = {
  RED: "#FB275D",
  YELLOW: "#FFCC00",
  GREEN: "#00CC6F",
  BLUE: "#009AFF",
  PURPLE: "#A358DF",
  LIGHT_BLUE: "#00CFF4",
};

const APP_FEATURE_TYPES = {
  BOARD_VIEW: "AppFeatureBoardView",
  BOARD_ITEM_MENU: "AppFeatureItemMenuAction",
  CUSTOM_OBJECT: "AppFeatureObject",
  DASHBOARD_WIDGET: "AppFeatureDashboardWidget",
  ITEM_VIEW: "AppFeatureItemView",
  AI_ASSISTANT_BOARD_HEADER: "AppFeatureAiBoardMainMenuHeader"
}

// when adding an option - make sure you have a route added to menuConstants.js & index.js
export const menuOptions = [
  {
    name: "Client SDK - perform actions in the monday client", 
    subOptions: [
      {
        name: "Get app context",
        location: ROUTES.GET_APP_CONTEXT,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
      {
        name: "Open Item Card",
        location: ROUTES.OPEN_ITEM_CARD,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
      {
        id: "CONFIRMATION",
        name: "Confirmation modal",
        location: "confirmation",
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.PURPLE,
      },
      {
        name: "Notice Pop-up or Toast",
        location: "notice",
        image: require("./assets/notice.png"),
        background: BACKGROUND_COLORS.BLUE,
      },
      {
        name: "Open app settings pane",
        location: ROUTES.OPEN_SETTINGS_PANE,
        image: require("./assets/notice.png"),
        background: BACKGROUND_COLORS.RED,
        disableFor: [APP_FEATURE_TYPES.BOARD_ITEM_MENU, APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER]
      },
      {
        name: "Preview & upload files",
        location: "filepreview",
        image: require("./assets/file_preview.png"),
        background: BACKGROUND_COLORS.RED,
      },
      {
        name: "Store data with Storage API",
        location: ROUTES.STORAGE_API,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER]
      },
      {
        name: "Listen to board events",
        location: ROUTES.LISTEN_TO_EVENTS,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER]
      },
      {
        name: "Listen to board filter",
        location: ROUTES.LISTEN_TO_BOARD_FILTER,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER]
      },
    ]
  },
  {name: "Platform API - Access & update board data", 
    subOptions: [
      {
        name: "Get & filter board items",
        location: ROUTES.GET_BOARD_ITEMS,
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.GREEN,
      }, 
      {
        name: "Get account workspaces",
        location: ROUTES.GET_WORKSPACES,
        image: require("./assets/delete_icon.png"),
        background: BACKGROUND_COLORS.BLUE,
      }, 
      {
        name: "Delete an item",
        location: ROUTES.DELETE_ITEM,
        image: require("./assets/delete_icon.png"),
        background: BACKGROUND_COLORS.YELLOW,
      }, 
      {
        name: "Cursor Pagination",
        location: ROUTES.PAGINATED,
        image: require("./assets/pagination.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
    ]
  },
  /**
  { 
    name: "Components in progress", //TODO: Delete this section
    subOptions: [
      {
        name: "Delete Item",
        location: ROUTES.DELETE_ITEM,
        image: require("./assets/delete_icon.png"),
        background: BACKGROUND_COLORS.YELLOW,
      }, 
    ]
  },
  {
    name: "Working With The Board - old", //TODO: Delete this section
    subOptions: [
      {
        name: "Delete Item",
        location: ROUTES.DELETE_ITEM,
        image: require("./assets/delete_icon.png"),
        background: BACKGROUND_COLORS.YELLOW,
      },
      {
        name: "Open Item Card",
        location: ROUTES.OPEN_ITEM_CARD,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
      {
        name: "Upload File via SDK",
        location: ROUTES.UPLOAD_FILE_VIA_SDK,
        image: require("./assets/sdk_icon.png"),
        background: BACKGROUND_COLORS.BLUE,
      },
      {
        name: "Upload File via API",
        location: ROUTES.UPLOAD_FILE_VIA_API,
        image: require("./assets/api_file.png"),
        background: BACKGROUND_COLORS.PURPLE,
      },
      {
        name: "Storage Api",
        location: ROUTES.STORAGE_API,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
      },
      {
        name: "Get Item Updates",
        location: ROUTES.UPDATES,
        image: require("./assets/item-updates.png"),
        background: BACKGROUND_COLORS.RED,
      },
    ],
  },
  {
    name: "Subitems - old", //TODO: Delete this section
    subOptions: [
      {
        id: "GETTING_SUBITEMS_OF_AN_ITEM",
        name: "Getting Subitem Of An Item",
        location: ROUTES.GET_SUB_ITEMS,
        image: require("./assets/update-subitem.png"),
        background: BACKGROUND_COLORS.RED,
      },
      {
        id: "UPDATE_SUBITEM",
        name: "Update Subitem",
        location: ROUTES.UPDATE_SUBITEM,
        image: require("./assets/update-subitem.png"),
        background: BACKGROUND_COLORS.YELLOW,
      },
      {
        id: "ARCHIVE_SUBITEM",
        name: "Archive Subitem",
        location: ROUTES.ARCHIVE_SUBITEM,
        image: require("./assets/archive.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
      {
        id: "DELETE_SUBITEM",
        name: "Delete Subitem",
        location: ROUTES.DELETE_SUBITEM,
        image: require("./assets/delete-subitem.png"),
        background: BACKGROUND_COLORS.BLUE,
      },
    ],
  },
  {
    name: "UI - old", //TODO: Delete this section
    subOptions: [
      {
        id: "CONFIRMATION",
        name: "Confirmation Pop Up",
        location: "confirmation",
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.PURPLE,
      },
      {
        name: "Notice Pop Up",
        location: "notice",
        image: require("./assets/notice.png"),
        background: BACKGROUND_COLORS.BLUE,
      },
      
    ],
  },
  {
    name: "Working With Settings - old", //TODO: Delete this section
    subOptions: [
      {
        id: "WORKING_WITH_SETTINGS",
        name: "Working With Settings",
        location: "workingWithSettings",
        image: require("./assets/settings.png"),
        background: BACKGROUND_COLORS.YELLOW,
      },
    ],
  },
   */
];
