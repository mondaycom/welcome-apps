import React, { useState, useEffect, useContext } from "react";
import "./UploadFileViaSDK.scss";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import uploadFileViaSDKConstants from "./uploadFileViaSDKConstants";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import Dropdown from "monday-ui-react-core/dist/Dropdown.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";

const monday = mondaySdk();

const UploadFileViaSDK = () => {
  const { items, boardId } = useContext(Context);
  const [fileColumns, setFileColumns] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const isFileColumnsExist = fileColumns.length > 0;

  const handleUploadFile = (column) => {
    if (!column) return;
    monday
      .execute("triggerFilesUpload", {
        boardId: +boardId,
        itemId: +selectedItem.id,
        columnId: column.value,
      })
      .then((res) => {
        monday.execute("notice", {
          message: "File uploaded successfully",
          type: "success",
          timeout: 10000,
        });
      })
      .finally(() => setSelectedItem());
  };

  useEffect(() => {
    if (!boardId) return;
    // ----- GETS ALL BOARD COLUMNS -----
    monday
      .api(uploadFileViaSDKConstants.getAllColumnsQuery, {
        variables: { boardIds: boardId },
      })
      .then((res) => {
        const fileColumns = res.data?.boards[0]?.columns.filter((column) => column.type === "file");
        setFileColumns(fileColumns);
      });
  }, [boardId]);

  return (
    <div className="upload-file-container feature-container">
      <ActionHeader
        action="Upload File via SDK"
        actionDescription="Using the SDK to upload file to specific column of an item"
      />
      <RenderItems
        itemsData={items}
        actionButtonContent="Upload File"
        action={
          isFileColumnsExist
            ? (item) => {
                setSelectedItem(item);
              }
            : null
        }
      />
      <CodeBlock contentUrl={uploadFileViaSDKConstants.githubUrl} />
      <Instructions
        paragraphs={uploadFileViaSDKConstants.uploadFileViaSDKInstructionsParagraphs}
        instructionsListItems={uploadFileViaSDKConstants.uploadFileViaSDKInstructionsListItems}
        linkToDocumentation={uploadFileViaSDKConstants.uploadFileViaSDKInstrctionslinkToDocumentation}
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
              clearable={true}
              searchable={true}
              options={fileColumns.map((fileColumn) => {
                return { value: fileColumn.id, label: `${fileColumn.title} - ${fileColumn.id}` };
              })}
              placeholder="Files Columns"
              onChange={(column) => handleUploadFile(column)}
            />
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};

export default UploadFileViaSDK;
