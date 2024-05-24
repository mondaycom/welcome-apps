import React, { useState, useEffect, useRef, useContext } from "react";
import "./UploadFileViaAPI.scss";
import mondaySdk from "monday-sdk-js";
import uploadFileViaAPIConstants from "./uploadFileViaAPIConstants";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import Dropdown from "monday-ui-react-core/dist/Dropdown.js";
import Button from "monday-ui-react-core/dist/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import Instructions from "../../components/common/Instructions/Instructions";
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const UploadFileViaAPI = () => {
  const { items, boardId } = useBoardContext().state;
  const [fileColumns, setFileColumns] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [columnId, setColumnId] = useState("");
  const [file, setFile] = useState();
  const isFileColumnsExist = fileColumns.length > 0;
  const fileInput = useRef(null);

  const handleFileUpload = () => {
    if (selectedItem && columnId && file) {
      const itemId = +selectedItem.id;
      monday
        .api(uploadFileViaAPIConstants.uploadFile, {
          variables: {
            column_id: columnId,
            item_id: itemId,
            file: file,
          },
        })
        .then((res) => {
          monday.execute("notice", {
            message: "File uploaded successfully",
            type: "success",
            timeout: 10000,
          });
        })
        .catch((err) => {
          monday.execute("notice", {
            message: "Failed to upload",
            type: "error",
            timeout: 10000,
          });
        })
        .finally(() => {
          setSelectedItem("");
          setColumnId("");
          setFile();
        });
    }
  };

  useEffect(() => {
    // ----- GETS ALL BOARD COLUMNS -----
    monday
      .api(uploadFileViaAPIConstants.getAllColumnsQuery, {
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
        action="Upload File via API"
        actionDescription="Using the API to upload file to specific column of an item"
      />

      <RenderItems
        itemsData={items}
        actionButtonContent="Upload File"
        action={
          isFileColumnsExist
            ? (item) => {
                setSelectedItem(item);
                setColumnId("");
                setFile();
              }
            : null
        }
      />
      <CodeBlock contentUrl={uploadFileViaAPIConstants.githubUrl} />
      <Instructions
        paragraphs={uploadFileViaAPIConstants.uploadFileViaAPIInstructionsParagraphs}
        instructionsListItems={uploadFileViaAPIConstants.uploadFileViaAPIInstructionsListItems}
        linkToDocumentation={uploadFileViaAPIConstants.uploadFileViaAPIInstructionslinkToDocumentation}
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
              placeholder={"Files Columns"}
              onChange={(column) => setColumnId(column.value)}
            />
            <div className="buttons">
              <Button onClick={() => fileInput.current.click()}>Pick A File</Button>
              <input
                style={{ display: "none" }}
                ref={fileInput}
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
              ></input>
              <p className="ellipsis">{file && file.name}</p>
              <Button disabled={!file || !columnId} onClick={handleFileUpload}>
                Upload
              </Button>
            </div>
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};

export default UploadFileViaAPI;
