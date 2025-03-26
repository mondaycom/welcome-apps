# Monday Webhook Events: Full JSON and How to Identify

This page provides a reference of different Monday.com webhook event payloads, how to identify them based on their JSON attributes, and how they map to specific event types.

## 1. Change Subitem Column Value

```json
{
  "event": {
    "app": "monday",
    "type": "update_column_value",
    "triggerTime": "2025-02-04T19:20:55.314Z",
    "subscriptionId": 466701570,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "groupId": "topics",
    "pulseId": 7786784003,
    "pulseName": "Designer",
    "columnId": "subitems_mkmvfz5",
    "columnType": "subtasks",
    "columnTitle": "Subitems",
    "value": {
      "linkedPulseIds": [
        {
          "linkedPulseId": 8401360357
        }
      ],
      "changed_at": "2025-02-04 19:20:54 +0000"
    },
    "previousValue": {},
    "changedAt": 1738696854.8188913,
    "isTopGroup": true,
    "triggerUuid": "49f0a0d4ce4cb26243f8a677f62b8332"
  }
}
```

**How to identify:**
- The type is "update_column_value"
- The column has "columnType": "subtasks", or you see that it affects the subitem column

## 2. Create Subitem

```json
{
  "event": {
    "app": "monday",
    "type": "create_pulse",
    "triggerTime": "2025-02-04T19:20:55.528Z",
    "subscriptionId": 466733181,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "pulseId": 8401360357,
    "pulseName": "Test",
    "groupId": "topics",
    "groupName": "Subitems",
    "groupColor": "#579bfc",
    "isTopGroup": true,
    "columnValues": {},
    "triggerUuid": "22c02a9f4fb60361cbc505bb71e5b3ed",
    "parentItemId": "7786784003",
    "parentItemBoardId": "7786783342",
    "itemId": 8401360357
  }
}
```

**How to identify:**
- The type is "create_pulse"
- It has a parentItemId, meaning this is a subitem creation event

## 3. Change Name (Main Item)

```json
{
  "event": {
    "app": "monday",
    "type": "update_name",
    "triggerTime": "2025-02-05T16:10:40.628Z",
    "subscriptionId": 466701496,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "groupId": "topics",
    "pulseId": 7786784003,
    "value": {
      "name": "New Name 2"
    },
    "previousValue": {
      "name": "New Name"
    },
    "triggerUuid": "4aff9597f96cc3d3bafa206540e308ff"
  }
}
```

**How to identify:**
- The type is "update_name"
- There is no parentItemId (it's a top-level item's name change)

## 4. Create Item

```json
{
  "event": {
    "app": "monday",
    "type": "create_pulse",
    "triggerTime": "2025-02-05T16:28:02.630Z",
    "subscriptionId": 466701503,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 8409778368,
    "pulseName": "New item 1",
    "groupId": "topics",
    "groupName": "Assignments",
    "groupColor": "#579bfc",
    "isTopGroup": true,
    "columnValues": {},
    "triggerUuid": "c95b27e82a81cc6a81db4f5e97d80858"
  }
}
```

**How to identify:**
- Type is "create_pulse"
- No parentItemId, so it's a brand-new main item

## 5. Change Subitem Name

```json
{
  "event": {
    "app": "monday",
    "type": "update_name",
    "triggerTime": "2025-02-05T16:31:24.570Z",
    "subscriptionId": 466733176,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "groupId": "topics",
    "pulseId": 8409660303,
    "value": {
      "name": "New sub name"
    },
    "previousValue": {
      "name": "New sub"
    },
    "triggerUuid": "53a4d574eefe643ca8f16b4b5bf6bca2",
    "parentItemId": "7786784003",
    "parentItemBoardId": "7786783342"
  }
}
```

**How to identify:**
- Type is "update_name"
- It includes parentItemId, so that means a subitem name change

## 6. Item Archived

```json
{
  "event": {
    "app": "monday",
    "type": "archive_pulse",
    "triggerTime": "2025-02-05T16:41:14.158Z",
    "subscriptionId": 466701506,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "itemId": 8409778368,
    "itemName": "New item 1",
    "triggerUuid": "b5881b62b4fa43528487dfd01d306be2"
  }
}
```

**How to identify:**
- Type is "archive_pulse"
- No parentItemId in the JSON, so it's a top-level item archived

## 7. Item Restored

```json
{
  "event": {
    "app": "monday",
    "type": "restore_pulse",
    "triggerTime": "2025-02-05T16:41:16.656Z",
    "subscriptionId": 466701545,
    "isRetry": false,
    "userId": 67214742,
    "value": {
      "state": 1,
      "is_undo": true
    },
    "previousValue": {
      "state": 2
    },
    "boardId": 7786783342,
    "itemId": 8409778368,
    "itemName": "New item 1",
    "triggerUuid": "63052f61aa5827ae278ec3986795bd45"
  }
}
```

**How to identify:**
- Type is "restore_pulse"
- No mention of parentItemId

## 8. Item Deleted

```json
{
  "event": {
    "app": "monday",
    "type": "delete_pulse",
    "triggerTime": "2025-02-05T16:42:35.957Z",
    "subscriptionId": 466701507,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "itemId": 8409778368,
    "itemName": "New item 1",
    "triggerUuid": "b95777fd072aab62280dfb409b81232b"
  }
}
```

**How to identify:**
- Type is "delete_pulse"
- No parentItemId

## 9. Subitem Archived

```json
{
  "event": {
    "app": "monday",
    "type": "archive_pulse",
    "triggerTime": "2025-02-05T17:00:12.100Z",
    "subscriptionId": 466733168,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "itemId": 8409660303,
    "itemName": "New sub name",
    "parentBoardId": 7786783342,
    "parentItemId": 7786784003,
    "triggerUuid": "39bce9c477252c8aff7f04c56c64921b",
    "pulseId": 8409660303
  }
}
```

**How to identify:**
- Type is "archive_pulse"
- Has parentItemId, so it's a subitem being archived

## 10. Move Subitem

```json
{
  "event": {
    "app": "monday",
    "type": "move_subitem",
    "triggerTime": "2025-02-05T17:32:36.884Z",
    "subscriptionId": 466701546,
    "isRetry": false,
    "userId": 67214742,
    "sourcePulseId": 7786784003,
    "destPulseId": 7786784079,
    "sourceBoardId": 7786783342,
    "destBoardId": 7786783342,
    "subitem": 8401360357,
    "triggerUuid": "c88ea0f27724e1102fe91a8f6c409a6a"
  }
}
```

**How to identify:**
- Type is "move_subitem"

## 11. Subitem Deleted

```json
{
  "event": {
    "app": "monday",
    "type": "delete_pulse",
    "triggerTime": "2025-02-05T17:33:07.343Z",
    "subscriptionId": 466733163,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "itemId": 8401360357,
    "itemName": "Test",
    "parentBoardId": 7786783342,
    "parentItemId": 7786784079,
    "triggerUuid": "047c674502f69e5af7c6c5cf2ee0cef1",
    "pulseId": 8401360357
  }
}
```

**How to identify:**
- Type is "delete_pulse"
- Includes parentItemId, indicating it's a subitem deletion

## 12. Create Column

```json
{
  "event": {
    "app": "monday",
    "type": "create_column",
    "triggerTime": "2025-02-05T17:33:44.905Z",
    "subscriptionId": 466701562,
    "isRetry": false,
    "userId": 67214742,
    "accountId": 25917229,
    "entity": "board",
    "boardId": 7786783342,
    "columnId": "text_mkmw91z2",
    "columnTitle": "Text",
    "columnType": "text",
    "createdAt": 1738776824.3904877,
    "retryCount": 0,
    "triggerUuid": "ac00a2fb58493282b2de059b4dc637a1"
  }
}
```

**How to identify:**
- Type is "create_column"

## 13. Move Pulse Into Group

```json
{
  "event": {
    "app": "monday",
    "type": "move_pulse_into_group",
    "triggerTime": "2025-02-05T17:34:21.803Z",
    "subscriptionId": 466701509,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 7786784190,
    "sourceGroupId": "topics",
    "destGroupId": "new_group_mkmwnd8t",
    "destGroup": {
      "id": "new_group_mkmwnd8t",
      "title": "New Group",
      "color": "#cab641",
      "is_top_group": false
    },
    "triggerUuid": "936f1a3c4bf8bd2a1c2353481c49b9e4"
  }
}
```

**How to identify:**
- Type is "move_pulse_into_group"
- No parentItemId, so it's a main item moving between groups

## 14. Create Update

```json
{
  "event": {
    "app": "monday",
    "type": "create_update",
    "triggerTime": "2025-02-05T17:47:46.197Z",
    "subscriptionId": 466651336,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 7786784156,
    "body": "1st update",
    "textBody": "1st update",
    "updateId": 3836364238,
    "replyId": null,
    "triggerUuid": "139a7dfd8d6dae97912243b223881316"
  }
}
```

**How to identify:**
- Type = "create_update"
- No parentItemId, so it's on a main item

## 15. Edit Update

```json
{
  "event": {
    "app": "monday",
    "type": "edit_update",
    "triggerTime": "2025-02-05T17:49:31.431Z",
    "subscriptionId": 466651288,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 7786784156,
    "body": "1st update edit",
    "textBody": "1st update edit\n\n",
    "updateId": 3836364238,
    "replyId": null,
    "triggerUuid": "75ca8a1132e37c149e431f6de8b44e0c"
  }
}
```

**How to identify:**
- Type is "edit_update"

## 16. Delete Update

```json
{
  "event": {
    "app": "monday",
    "type": "delete_update",
    "triggerTime": "2025-02-05T17:49:59.637Z",
    "subscriptionId": 466651396,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 7786784156,
    "body": "1st update edit",
    "textBody": "1st update edit\n\n",
    "updateId": 3836364238,
    "replyId": null,
    "triggerUuid": "e1dbc3ff27670125dba4bcdc8b60f70c"
  }
}
```

**How to identify:**
- Type is "delete_update"

## 17. Create Subitem Update

```json
{
  "event": {
    "app": "monday",
    "type": "create_update",
    "triggerTime": "2025-02-05T17:51:33.230Z",
    "subscriptionId": 466733101,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "pulseId": 8410713429,
    "body": "update sub",
    "textBody": "update sub\n\n",
    "updateId": 3836377665,
    "replyId": null,
    "triggerUuid": "ee8c597510b00b604d128df903e7acee",
    "parentItemId": "7786784156",
    "parentItemBoardId": "7786783342"
  }
}
```

**How to identify:**
- Type = "create_update"
- Has parentItemId, so it's an update on a subitem

## 18. Change Subitem Column Value

```json
{
  "event": {
    "app": "monday",
    "type": "update_column_value",
    "triggerTime": "2025-02-05T17:52:13.231Z",
    "subscriptionId": 466733063,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 8400809115,
    "groupId": "topics",
    "pulseId": 8410713429,
    "pulseName": "new",
    "columnId": "date0",
    "columnType": "date",
    "columnTitle": "Date",
    "value": {
      "date": "2025-02-05",
      "icon": null,
      "time": null,
      "changed_at": "2025-02-05T17:52:12.147Z"
    },
    "previousValue": null,
    "changedAt": 1738777932.8182862,
    "isTopGroup": true,
    "triggerUuid": "47bf0728745aae379a3905db5bff2d67",
    "parentItemId": "7786784156",
    "parentItemBoardId": "7786783342"
  }
}
```

**How to identify:**
- Type = "update_column_value"
- Has parentItemId, so it's a subitem column change (a "Date" column in this example)

## 19. Change Status Column Value

```json
{
  "event": {
    "app": "monday",
    "type": "update_column_value",
    "triggerTime": "2025-02-05T17:52:53.186Z",
    "subscriptionId": 466701570,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "groupId": "topics",
    "pulseId": 7786784079,
    "pulseName": "Developer",
    "columnId": "status_mkmwnxnk",
    "columnType": "color",
    "columnTitle": "Status",
    "value": {
      "label": {
        "index": 0,
        "text": "Working on it",
        "style": {
          "color": "#fdab3d",
          "border": "#e99729",
          "var_name": "orange"
        },
        "is_done": false
      },
      "post_id": null
    },
    "previousValue": null,
    "changedAt": 1738777972.386279,
    "isTopGroup": true,
    "triggerUuid": "179d9f2b3f2bc19d141f4bc53764cf01"
  }
}
```

**How to identify:**
- Type = "update_column_value"
- ColumnType = "color" (i.e. a Status column)
- No parentItemId, so it's the main item

## 20. Move Pulse Into Group

```json
{
  "event": {
    "app": "monday",
    "type": "move_pulse_into_group",
    "triggerTime": "2025-02-05T17:55:51.628Z",
    "subscriptionId": 467172824,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "pulseId": 7786784190,
    "sourceGroupId": "new_group_mkmwnd8t",
    "destGroupId": "topics",
    "destGroup": {
      "id": "topics",
      "title": "Assignments",
      "color": "#579bfc",
      "is_top_group": true
    },
    "triggerUuid": "1d536f546783422a151ab13bd11dc277"
  }
}
```

**How to identify:**
- Type is "move_pulse_into_group"
- No parentItemId, so it's a main item

## 21. Change Column Value

```json
{
  "event": {
    "app": "monday",
    "type": "update_column_value",
    "triggerTime": "2025-02-05T17:56:59.644Z",
    "subscriptionId": 467172818,
    "isRetry": false,
    "userId": 67214742,
    "originalTriggerUuid": null,
    "boardId": 7786783342,
    "groupId": "topics",
    "pulseId": 7786784003,
    "pulseName": "New Name 2",
    "columnId": "person",
    "columnType": "multiple-person",
    "columnTitle": "Person",
    "value": {
      "personsAndTeams": [
        {
          "id": 67214742,
          "kind": "person"
        }
      ],
      "changed_at": "2025-02-05T17:56:58.364Z"
    },
    "previousValue": {},
    "changedAt": 1738778219.220086,
    "isTopGroup": true,
    "triggerUuid": "ce4142601c988c58afa9274fe3f363aa"
  }
}
```

**How to identify:**
- Type = "update_column_value"
- Column is "multiple-person" (not subitem, not status)
- No parentItemId, so it's a main item's generic column change

## Quick Reference

Here's a concise mapping of type and conditions to event names:

### create_pulse
- No parentItemId → create_item
- Has parentItemId → create_subitem

### archive_pulse / delete_pulse / restore_pulse
- No parentItemId → main item → item_archived, item_deleted, item_restored
- Has parentItemId → subitem → subitem_archived, subitem_deleted

### update_name
- No parentItemId → change_name
- Has parentItemId → change_subitem_name

### move_subitem
- move_subitem → move_subitem

### move_pulse_into_group
- item_moved_to_any_group or item_moved_to_specific_group → move_pulse_into_group

### create_update / edit_update / delete_update
- No parentItemId → main item's update (create_update, etc.)
- Has parentItemId → subitem update (e.g. create_subitem_update)

### update_column_value
Can map to various "change_X_column_value":
- If columnType=color and no parentItemId → change_status_column_value
- If columnType=subtasks or you see parentItemId → change_subitem_column_value
- Otherwise (main item, non-status) → change_column_value

### create_column
- create_column → create_column 