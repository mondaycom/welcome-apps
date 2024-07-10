import React, { useState, useEffect } from "react";
import "./FilePreview.scss";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import Dropdown from "monday-ui-react-core/dist/Dropdown.js";
import Button from "monday-ui-react-core/dist/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import filePreviewConstants from "./FilePreviewConstants";
import Loader from "monday-ui-react-core/dist/Loader";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import Instructions from "../../components/common/Instructions/Instructions";
// import { useBoardContext } from "../../hooks/UseBoardContext.js";
import { useAppContext } from "../../hooks/UseAppContext.js";
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
      <div className="playground working-with-the-board-items">
      <TabLayout
        ExampleComponent={FilePreviewSample}
        codeExample={CodeSamples.FilePreview.codeSample}
        documentationText={`This is a file preview.`}
      />
      </div>
    </div>
  );
};

// TODO: Delete this component
// eslint-disable-next-line no-unused-vars
const FilePreviewOld = () => {
  // const boardContext = useBoardContext();
  const appContext = useAppContext();

  const boardItems = useGetBoardData();
  const items = boardItems?.items ?? [];
  const boardId = "6980589817";
  // const { items, boardId } = boardContext;
  console.log(`context is - ${JSON.stringify(appContext)}`);
  // const { items, boardId } = 0;

  if (appContext) {
  }

  const [fileColumns, setFileColumns] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [columnId, setColumnId] = useState("");
  const [assets, setAssets] = useState([]);
  const isFileColumnsExist = fileColumns.length > 0;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();

  useEffect(() => {
    // ----- GETS ALL BOARD COLUMNS -----
    monday
      .api(filePreviewConstants.getAllColumnsQuery, {
        variables: { boardIds: boardId },
      })
      .then((res) => {
        const fileColumns = res.data?.boards[0]?.columns.filter(
          (column) => column.type === "file"
        );
        setFileColumns(fileColumns);
      });
  }, [boardId]);

  const handleFilePreview = () => {
    monday.execute("openFilesDialog", {
      boardId: +boardId,
      itemId: +selectedItem.id,
      columnId,
      assetId: selectedAsset,
    });
  };

  const handleColumnIdPick = (column_id) => {
    setColumnId(column_id);
    setIsLoading(true);
    monday
      .api(filePreviewConstants.getAssetsQuery, {
        variables: { board_id: +boardId, item_id: +selectedItem.id, column_id },
      })
      .then((res) => {
        setAssets(res.data.boards[0].items[0].assets);
        setIsLoading(false);
        setSelectedAsset();
      });
  };

  return (
    <div className="upload-file-container feature-container">
      <ActionHeader
        action="File Preview Via SDK"
        actionDescription="Using the SDK to preview file from specific column"
      />
      <RenderItems
        itemsData={items}
        actionButtonContent="Preview File"
        action={
          isFileColumnsExist
            ? (item) => {
                setSelectedItem(item);
                setColumnId("");
              }
            : null
        }
      />
      <CodeBlock contentUrl={filePreviewConstants.githubUrl} />
      <Instructions
        paragraphs={filePreviewConstants.filePreviewInstructionsParagraphs}
        instructionsListItems={
          filePreviewConstants.filePreviewInstructionsListItems
        }
        linkToDocumentation={
          filePreviewConstants.filePreviewInstructionslinkToDocumentation
        }
      />
      {selectedItem && (
        <div className="overlay">
          <DialogContentContainer className="popup">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                setSelectedItem();
              }}
            />
            <span>Please select a file column</span>

            <Dropdown
              searchable={true}
              options={fileColumns.map((fileColumn) => {
                return {
                  value: fileColumn.id,
                  label: `${fileColumn.title} - ${fileColumn.id} (Column ID)`,
                };
              })}
              placeholder={"Files Columns"}
              onChange={(column) => handleColumnIdPick(column.value)}
            />
            <br />
            {assets.length > 0 ? (
              <Dropdown
                searchable={true}
                options={assets.map((asset) => {
                  return {
                    value: asset.id,
                    label: `${asset.name} - ${asset.id}`,
                  };
                })}
                placeholder={"File Name"}
                onChange={(asset) => setSelectedAsset(asset.value)}
              />
            ) : (
              columnId &&
              assets.length === 0 &&
              !isLoading &&
              "No Assets To Show..."
            )}
            {isLoading && (
              <div className="loader-container">
                <Loader />
              </div>
            )}
            <div className="buttons">
              <Button disabled={!selectedAsset} onClick={handleFilePreview}>
                Preview File
              </Button>
            </div>
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
