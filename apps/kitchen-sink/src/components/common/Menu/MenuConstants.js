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
  FILTER_BOARD_ITEMS: "filter_board_items",
  GET_WORKSPACES: "get_workspaces",
};

const BACKGROUND_COLORS = {
  RED: "#df2f4a",
  YELLOW: "#ffcb00",
  GREEN: "#00c875",
  BLUE: "#66ccff",
  PURPLE: "#9d50dd",
  LIGHT_BLUE: "#579bfc",
};

const APP_FEATURE_TYPES = {
  BOARD_VIEW: "AppFeatureBoardView",
  BOARD_ITEM_MENU: "AppFeatureItemMenuAction",
  BOARD_ITEM_BATCH_ACTION: "AppFeatureItemBatchAction",
  CUSTOM_OBJECT: "AppFeatureObject",
  DASHBOARD_WIDGET: "AppFeatureDashboardWidget",
  ITEM_VIEW: "AppFeatureItemView",
  AI_ASSISTANT_BOARD_HEADER: "AppFeatureAiBoardMainMenuHeader",
  ACCOUNT_SETTINGS_VIEW: "AppFeatureAccountSettingsView",
  AI_ASSISTANT_ITEM_UPDATE: "AppFeatureAiItemUpdateActions",
}

// when adding an option - make sure you have a route added to menuConstants.js & index.js
export const menuOptions = [
  {
    name: "Client SDK – Read & manage your app context",
    subOptions: [
      {
        name: "Get app context",
        location: ROUTES.GET_APP_CONTEXT,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.GREEN,
      },
      {
        name: "Open app settings pane",
        location: ROUTES.OPEN_SETTINGS_PANE,
        image: require("./assets/notice.png"),
        background: BACKGROUND_COLORS.RED,
        disableFor: [APP_FEATURE_TYPES.BOARD_ITEM_MENU, APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER, APP_FEATURE_TYPES.BOARD_ITEM_BATCH_ACTION, APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW, APP_FEATURE_TYPES.AI_ASSISTANT_ITEM_UPDATE]
      },
      {
        name: "Listen to board events",
        location: ROUTES.LISTEN_TO_EVENTS,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
      {
        name: "Listen to board filter",
        location: ROUTES.LISTEN_TO_BOARD_FILTER,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
    ]
  },
  {
    name: "Client SDK - Perform actions in the monday client", 
    subOptions: [
      
      {
        name: "Open Item Card",
        location: ROUTES.OPEN_ITEM_CARD,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.GREEN,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
      {
        name: "Create Item Card",
        location: ROUTES.CREATE_ITEM,
        image: require("./assets/table.png"),
        background: BACKGROUND_COLORS.YELLOW,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
      {
        id: "CONFIRMATION",
        name: "Open a confirmation modal",
        location: "confirmation",
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.PURPLE,
      },
      {
        name: "Open a toast (or notice)",
        location: "notice",
        image: require("./assets/notice.png"),
        background: BACKGROUND_COLORS.BLUE,
      },
      
      {
        name: "Preview & upload files",
        location: "filepreview",
        image: require("./assets/file_preview.png"),
        background: BACKGROUND_COLORS.RED,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
      {
        name: "Store data with Storage API",
        location: ROUTES.STORAGE_API,
        image: require("./assets/storage_api.png"),
        background: BACKGROUND_COLORS.LIGHT_BLUE,
        disableFor: [APP_FEATURE_TYPES.AI_ASSISTANT_BOARD_HEADER]
      },
      
    ]
  },
  {name: "Platform API - Access & update board data", 
    subOptions: [
      {
        name: "Get board items",
        location: ROUTES.GET_BOARD_ITEMS,
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.GREEN,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      }, 
      {
        name: "Filter items on board",
        location: ROUTES.FILTER_BOARD_ITEMS,
        image: require("./assets/confirmation.png"),
        background: BACKGROUND_COLORS.PURPLE,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
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
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      }, 
      {
        name: "Cursor Pagination",
        location: ROUTES.PAGINATED,
        image: require("./assets/pagination.png"),
        background: BACKGROUND_COLORS.GREEN,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
      {
        name: "Get Item Updates",
        location: ROUTES.UPDATES,
        image: require("./assets/item-updates.png"),
        background: BACKGROUND_COLORS.RED,
        disableFor: [APP_FEATURE_TYPES.ACCOUNT_SETTINGS_VIEW],
      },
    ]
  },
];
