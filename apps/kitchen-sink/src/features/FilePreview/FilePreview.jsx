import React, { useState, useEffect, useContext } from "react";
import "./FilePreview.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import Dropdown from "monday-ui-react-core/dist/Dropdown.js";
import Button from "monday-ui-react-core/dist/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../components/context/ContextProvider";
import filePreviewConstants from "./FilePreviewConstants";
import Loader from "monday-ui-react-core/dist/Loader";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import Instructions from "../../components/common/Instructions/Instructions";
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const FilePreview = () => {
  const { items, boardId } = useBoardContext().state;

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
        const fileColumns = res.data?.boards[0]?.columns.filter((column) => column.type === "file");
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
        instructionsListItems={filePreviewConstants.filePreviewInstructionsListItems}
        linkToDocumentation={filePreviewConstants.filePreviewInstructionslinkToDocumentation}
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
                return { value: fileColumn.id, label: `${fileColumn.title} - ${fileColumn.id} (Column ID)` };
              })}
              placeholder={"Files Columns"}
              onChange={(column) => handleColumnIdPick(column.value)}
            />
            <br />
            {assets.length > 0 ? (
              <Dropdown
                searchable={true}
                options={assets.map((asset) => {
                  return { value: asset.id, label: `${asset.name} - ${asset.id}` };
                })}
                placeholder={"File Name"}
                onChange={(asset) => setSelectedAsset(asset.value)}
              />
            ) : (
              columnId && assets.length === 0 && !isLoading && "No Assets To Show..."
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
