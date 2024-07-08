const uploadFileViaAPIConstants = {
  uploadFile: `mutation ($column_id: String!, $file: File!, $item_id: Int!) {
    add_file_to_column(item_id: $item_id, column_id: $column_id, file: $file) {
      id
    }
  }
  
  `,
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
  uploadFileViaAPIInstructionsParagraphs: [
    `Any file you upload to monday.com is saved as an asset. Every asset has an ID that is used to identify it in an account.`,
    `You can query for assets by their IDs or get them through the Updates or Items queries.`,
  ],
  uploadFileViaAPIInstructionslinkToDocumentation: `https://api.developer.monday.com/docs/files-queries`,
  uploadFileViaAPIInstructionsListItems: [
    `Select An Item.`,
    `Fetch all the file's column of the board and choose one.`,
    `Let the user upload a file.`,
    `Send mutation query to Monday's api`,
  ],
  githubUrl: "UploadFileViaAPI/UploadFileViaAPI.jsx",
};

export default uploadFileViaAPIConstants;
