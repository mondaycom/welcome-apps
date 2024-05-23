const uploadFileViaSDKConstants = {
  getAllColumnsQuery: `query ($boardIds: [Int]) {
    boards(ids: $boardIds) {
      columns {
        id
        title
        type
      }
    }
  }
    `,
  uploadFileViaSDKInstructionsParagraphs: [
    `Opens a modal to let the current user upload a file to a specific file column.`,
    `Returns a promise. In case of error, the promise is rejected.`,
    `After the file is successfully uploaded, the "change_column_value" event will be triggered. See the monday.listen('events', callback) method to subscribe to these events.`,
  ],
  uploadFileViaSDKInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
  uploadFileViaSDKInstructionsListItems: [
    `Fetch the board id from context.`,
    `Fetch all the file's column of the board and choose one.`,
    `Select an item.`,
    `Call execute Monday's sdk method with "triggerFilesUpload" parameter sending the board id, item id and column id.`,
  ],
  githubUrl: "UploadFileViaSDK/UploadFileViaSDK.jsx",
};

export default uploadFileViaSDKConstants;
