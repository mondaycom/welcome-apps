import React, { useState, useEffect } from "react";
import "./UploadFileViaAPI.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import {Button, Loader} from "monday-ui-react-core";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import Instructions from "../../components/common/Instructions/Instructions";
import { useBoardContext } from "../../hooks/UseBoardContext.js";
import { useGetBoardData } from "../../hooks/UseGetBoardData.js";
import TabLayout from "../../components/common/TabLayout/TabLayout.jsx";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
const monday = mondaySdk();

function handleAddFileColumn() {
  // TODO: Add logic to create file column
  monday.execute('notice', {
    message: "No file column found on board, please add one",
    type: "error",
  })
}

const FileUploadSample = () => {
  const [isLoading, setIsLoading] = useState(true);
  const boardData = useGetBoardData();
  const [fileColumns, setFileColumns] = useState([]);

  useEffect(() => {
    if (boardData.boards) {
      setIsLoading(false);
      setFileColumns(
        boardData.boards[0].columns.filter((x) => x.type === "file")
      );
    }
  }, [boardData]);

  // @mondaycom-codesample-skip-block-start
  useEffect(
    function printState() {
      console.log({ fileColumns });
      console.log({ boardData });
    },
    [fileColumns, boardData]
  );
  // @mondaycom-codesample-skip-block-end

  return (
    <div>
      {isLoading ? (
        <Loader size={16} />
      ) : fileColumns.length > 0 ? (
        <RenderItems
          itemsData={boardData.boards[0].items_page.items}
          actionButtonContent="Add or preview File"
          action={(item) => {
            const fileColumnId = fileColumns[0].id;
            const itemId = item.id;
            const boardId = boardData.boards[0].id;
          }}
        />
      ) : (
        <Button onClick={handleAddFileColumn}>Add file column</Button>
      )}
    </div>
  );
};
// @mondaycom-codesample-end

const uploadFileViaAPIConstants = {
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
  instructionsParagraphs: [
    `Opens a modal to upload a file.`,
    `After user selects the file, uploads the file using GraphQL API.`,
  ],
  instructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
  instructionsListItems: [
    `Fetch the board id from context.`,
    `Fetch all the file's column of the board and choose one.`,
    `Select an item.`,
    `Call execute Monday's sdk method with "triggerFilesUpload" parameter sending the board id, item id and column id.`,
  ],
  githubUrl: "UploadFileViaAPI/UploadFileViaAPI.jsx",
};

const UploadFileViaAPI = () => {
  return (
    <div className="file-preview-container feature-container">
      <ActionHeader
        action="File Preview"
        actionDescription="Preview and upload files using SDK"
      />
      <div className="tab-layout-playground">
      <TabLayout
        ExampleComponent={FileUploadSample}
        codeExample={CodeSamples.UploadFileViaAPI.codeSample}
      />
      </div>
      <Instructions
        className="instructions"
        paragraphs={uploadFileViaAPIConstants?.instructionsParagraphs}
        instructionsListItems={uploadFileViaAPIConstants?.instructionsListItems}
        linkToDocumentation={uploadFileViaAPIConstants.instructionslinkToDocumentation}
      />
      
    </div>
  );
};

export default UploadFileViaAPI;
