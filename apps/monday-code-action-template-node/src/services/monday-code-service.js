const { functionTypes } = require("../consts/supported-function-types")

/**
 * This array will routing creation
 * Every object in this array has to keep the standards of { route, type, function }
 *
 * @param obj.route - the access route to the function
 * @param obj.type - the type of the function (only types from `functionTypes` are supported)
 * @param obj.func - the logic to run when the route is accessed
 * @type {({route: string, func: (function(): Promise<*>), type: string})[]}
 */

const functionalityMapping = [
  {
    route: "/monday_code/execute_action",
    type: functionTypes.ACTION,
    func: actionLogic
  },
  {
    route: "/monday_code/get_remote_list_options",
    type: functionTypes.REMOTE_OPTIONS,
    func: getRemoteOptions
  }
]

/**
 * Action related logic is added in this function's body
 *
 * @param requestPayload - The payload from the trigger, context and user configurations
 * @param monday - initialized instance of monday-client, used to perform operations in monday.com on behalf of the user [https://github.com/mondaycom/monday-sdk-js]
 * @returns {Promise<any>}
 */
async function actionLogic({ requestPayload, monday }) {
  /** ############################################################### *
   *  #### Example implementation of action logic.              ##### *
   *  #### Replace this logic with your action implementation.  ##### *
   *  ############################################################### **/

  const { inputFields } = requestPayload;
  const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;

  const text = await getColumnValue(monday, itemId, sourceColumnId);
  if (!text) {
    return {};
  }

  const transformedText = transformText(
    text,
    transformationType ? transformationType.value : 'TO_UPPER_CASE'
  );

  await changeColumnValue(monday, boardId, itemId, targetColumnId, transformedText);

  return transformedText;
}


/**
 * Implement this function to return remote options that can be used as part of the integration.
 *
 * @returns {Promise<{title: string, value: string}[]>}
 */
async function getRemoteOptions() {
  /** ##################################################### *
   *  #### Example implementation of remote options.  ##### *
   *  #### Replace this with your remote options.     ##### *
   *  ##################################################### **/

  return TRANSFORMATION_TYPES;
}

module.exports = {
  functionalityMapping
};


/** ######################################################################## *
 *  #### Helper Functions & Data for the example implementations above ##### *
 *  ######################################################################## **/

const TO_UPPER_CASE = 'TO_UPPER_CASE';
const TO_LOWER_CASE = 'TO_LOWER_CASE';

const TRANSFORMATION_TYPES = [
  { title: 'to upper case', value: TO_UPPER_CASE },
  { title: 'to lower case', value: TO_LOWER_CASE }
];

const transformText = (value, type) => {
  switch (type) {
    case TO_UPPER_CASE:
      return value.toUpperCase();
    case TO_LOWER_CASE:
      return value.toLowerCase();
    default:
      return value.toUpperCase();
  }
};

const getColumnValue = async (mondayClient, itemId, columnId) => {
  try {
    const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    console.error(err);
  }
};

const changeColumnValue = async (mondayClient, boardId, itemId, columnId, value) => {
  try {
    const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};
