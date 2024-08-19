import React, { useState, useEffect } from "react";
import "./FilePreview.scss";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import RenderItems from "../RenderItems/RenderItems.jsx";
import Button from "monday-ui-react-core/dist/Button";
import filePreviewConstants from "./FilePreviewConstants";
import Loader from "monday-ui-react-core/dist/Loader";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import Instructions from "../../components/common/Instructions/Instructions";
import { useGetBoardData } from "../../hooks/UseGetBoardData.js";
import TabLayout from "../../components/common/TabLayout/TabLayout.jsx";
import CodeSamples from "../../constants/codeSamples";

const monday = mondaySdk();

function handleAddFileColumn() {
  // TODO: Add logic to create file column
  console.log(`You need to add a file column here.`);
}

// @mondaycom-codesample-start
const FilePreviewSample = () => {
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
            const fileColumnValue = JSON.parse(
              item.column_values.filter((x) => x.id === fileColumns[0].id)[0]
                .value
            );
            const assetId = fileColumnValue?.files[0]?.assetId ?? null;
            const boardId = boardData.boards[0].id;
            console.log({ item, assetId, fileColumnId });
            if (!assetId) {
              monday.execute("notice", {
                message: "No files uploaded. Uploading now...",
              });
              monday.execute("triggerFilesUpload", {
                boardId,
                itemId: item.id,
                columnId: fileColumnId,
              });
            } else {
              monday.execute("openFilesDialog", {
                boardId,
                itemId: item.id,
                columnId: fileColumnId,
                assetId,
              });
            }
          }}
        />
      ) : (
        <Button onClick={handleAddFileColumn}>Add file column</Button>
      )}
    </div>
  );
};
// @mondaycom-codesample-end

const FilePreview = () => {
  return (
    <div className="file-preview-container feature-container">
      <ActionHeader
        action="File Preview"
        actionDescription="Preview and upload files using SDK"
      />
      <div className="tab-layout-playground">
      <TabLayout
        ExampleComponent={FilePreviewSample}
        codeExample={CodeSamples.FilePreview.codeSample}
      />
      </div>
      <Instructions
        className="instructions"
        paragraphs={filePreviewConstants?.instructionsParagraphs}
        instructionsListItems={filePreviewConstants?.instructionsListItems}
        linkToDocumentation={filePreviewConstants?.githubUrl}
      />
      
    </div>
  );
};

export default FilePreview;