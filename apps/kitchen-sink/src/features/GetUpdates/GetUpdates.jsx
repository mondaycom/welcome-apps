import React, { useState, useEffect, useContext } from "react";
import "monday-ui-react-core/dist/main.css";
import "./GetUpdates.scss";
import mondaySdk from "monday-sdk-js";
import { getUpdatesConstants } from "./GetUpdatesConstants";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const GetUpdates = () => {
  const { items, boardId } = useBoardContext().state;
  const [selectedItem, setSelectedItem] = useState();
  const [updatesData, setUpdatesData] = useState([]);

  const noticeNoUpdatesForItem = () => {
    monday.execute(`notice`, {
      message: "The selected item doesn`t have updates.",
      type: "error",
      timeout: 10000,
    });
  };

  useEffect(() => {
    if (!selectedItem) return;
    monday
      .api(getUpdatesConstants.getUpdatesQuery, {
        variables: { board_id: boardId, item_id: +selectedItem.id },
      })
      .then((res) => {
        if (res.data.boards[0]?.items[0]?.updates.length === 0) {
          noticeNoUpdatesForItem();
          setUpdatesData([]);
          return;
        }
        const updatesData = res.data?.boards[0]?.items[0]?.updates.map((update) => {
          return { id: update.id, name: update.text_body };
        });
        setUpdatesData(updatesData);
        return function cleanup() {
          setUpdatesData([]);
        };
      });
  }, [boardId, selectedItem]);

  return (
    <div className="get-updates-items-container feature-container">
      <CodeBlock contentUrl={getUpdatesConstants.githubUrl} />
      <ActionHeader
        action="Get Item Updates"
        actionDescription="Using the api to get all updates of selected item"
      />

      <RenderItems
        itemsData={items}
        actionButtonContent="Get Updates"
        action={(item) => {
          setSelectedItem({ id: item.id, name: item.name });
        }}
      />
      <Instructions
        paragraphs={getUpdatesConstants.getUpdatesInstructionsParagraphs}
        instructionsListItems={getUpdatesConstants.getUpdatesInstructionsListItems}
        linkToDocumentation={getUpdatesConstants.getUpdatesInstructionslinkToDocumentation}
      />
      {updatesData.length > 0 && (
        <div className="overlay">
          <DialogContentContainer className="popup">
            <h3>Updates of {selectedItem.name}</h3>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                setSelectedItem();
                setUpdatesData([]);
              }}
            />
            <RenderItems itemsData={updatesData} />
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};

export default GetUpdates;
