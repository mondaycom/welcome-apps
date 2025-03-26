const ITEMS_LIMIT = 1000;
const ITEMS_PER_PAGE = 500;


// TODO replace with your own urls
// For local dev you can use the ngrok url from the BE, the ngrok url changes sometimes so be warned
// I often end up using the live url for local dev as well and just delpoy my app to the live url and do my testing there
// For deployed app you will use the live url
const WEBHOOK_URLS = {
  change_name: 'dummy_url.com/change-name',
  create_item: 'dummy_url.com/create-item',
  item_archived: 'dummy_url.com/item-archived',
  item_deleted: 'dummy_url.com/item-deleted',
  item_moved_to_any_group: 'dummy_url.com/item-moved-to-any-group',
  item_moved_to_specific_group: 'dummy_url.com/item-moved-to-specific-group',
  item_restored: 'dummy_url.com/item-restored',
  create_subitem: 'dummy_url.com/create-subitem',
  change_subitem_name: 'dummy_url.com/change-subitem-name',
  move_subitem: 'dummy_url.com/move-subitem',
  subitem_archived: 'dummy_url.com/subitem-archived',
  subitem_deleted: 'dummy_url.com/subitem-deleted',
  create_column: 'dummy_url.com/create-column',
  create_update: 'dummy_url.com/create-update',
  edit_update: 'dummy_url.com/edit-update',
  delete_update: 'dummy_url.com/delete-update',
  create_subitem_update: 'dummy_url.com/create-subitem-update',
  change_column_value: 'dummy_url.com/change-column-value',
  change_status_column_value: 'dummy_url.com/change-status-column-value',
  change_subitem_column_value: 'dummy_url.com/change-subitem-column-value',
  change_specific_column_value: 'dummy_url.com/change-specific-column-value',
};

export { ITEMS_LIMIT, ITEMS_PER_PAGE, WEBHOOK_URLS };