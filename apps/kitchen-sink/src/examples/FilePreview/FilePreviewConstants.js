const FilePreviewConstants = {
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

  getAssetsQuery: `query ($board_id: Int!, $item_id: Int!, $column_id: String!) {
        boards(ids: [$board_id]) {
          items(ids: [$item_id]) {
            assets(column_ids: [$column_id]) {
              id
              name
            }
          }
        }
      }
    `,
  filePreviewInstructionsParagraphs: [`Opens a modal with the preview of an asset`],
  filePreviewInstructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
  filePreviewInstructionsListItems: [
    `Fetch the board id from context.`,
    `Select An Item.`,
    `Fetch all the file's column of the board and choose one.`,
    `Query The assets ids from a specific column sending board id, item id and column id`,
    `Call execute Monday's sdk method with "openFilesDialog" parameter sending the board id, item id, column id and asset id.`,
  ],
  githubUrl: "FilePreview/FilePreview.jsx",
};

export default FilePreviewConstants;
