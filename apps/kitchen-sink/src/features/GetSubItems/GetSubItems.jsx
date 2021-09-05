import React, { useState, useEffect, useContext } from "react";
import "monday-ui-react-core/dist/main.css";
import "./GetSubItems.scss";
import mondaySdk from "monday-sdk-js";
import getSubItemsConstants from "./GetSubItemsConstants.js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";

const monday = mondaySdk();

const GetSubItems = () => {
  const { items, boardId } = useContext(Context);

  const [selectedItem, setSelectedItem] = useState();
  const [subitemsBoardId, setSubitemsBoardId] = useState();
  const [subitemsData, setSubitemsData] = useState([]);

  const noticeNoSubitemsForSelectedItems = () => {
    monday.execute(`notice`, {
      message: "Selected item doesn`t have subitems.",
      type: "error", // or "error" (red), or "info" (blue)
      timeout: 10000,
    });
  };

  useEffect(() => {
    // ----- GETS THE SUBITEMS BOARD ID AND BOARD ITEMS -----
    if (!boardId) return;
    monday
      .api(getSubItemsConstants.getAllColumnsQuery, {
        variables: { boardIds: [boardId] },
      })
      .then((res) => {
        const subTasksColumn = res.data?.boards[0]?.columns.find((column) => column.type === "subtasks");
        if (!subTasksColumn) {
          setSubitemsBoardId();
          return;
        } else {
          setSubitemsBoardId(JSON.parse(subTasksColumn.settings_str).boardIds[0]);
        }
      });
  }, [boardId]);

  useEffect(() => {
    if (!selectedItem) return;
    let subitemsIds;
    // ----- GETS ALL SUBITEMS IDS OF THE SELECTED ITEM -----

    monday
      .api(getSubItemsConstants.getAllSubItemsIdsOfAnItemQuery, {
        variables: { boardIds: boardId, itemIds: +selectedItem.id },
      })
      .then((res) => {
        if (
          !res.data.boards[0]?.items[0]?.column_values.find(
            (column) => column.type === "subtasks" || column.type === "subitems"
          )?.value
        ) {
          noticeNoSubitemsForSelectedItems();
          setSubitemsData([]);
          return;
        }
        const subitems = JSON.parse(res.data.boards[0].items[0].column_values[0].value).linkedPulseIds;
        if (!subitems) {
          noticeNoSubitemsForSelectedItems();
          return;
        }
        subitemsIds = JSON.parse(res.data.boards[0].items[0].column_values[0].value).linkedPulseIds.map(
          (linkedPulse) => {
            return +linkedPulse.linkedPulseId;
          }
        );
        // ----- GETS SUBITEMS DATA FROM SUBITEMS BOARD -----

        monday
          .api(getSubItemsConstants.getAllSubItemsQuery, {
            variables: { boardIds: subitemsBoardId, subitemsIds: subitemsIds },
          })
          .then((res) => {
            if (!res.data.boards[0]) {
              setSubitemsData([]);
              return;
            }
            setSubitemsData(res.data.boards[0].items);
          });
        return function cleanup() {
          setSubitemsData([]);
        };
      });
  }, [boardId, subitemsBoardId, selectedItem]);

  return (
    <div className="get-sub-items-container feature-container">
      <CodeBlock contentUrl={getSubItemsConstants.githubUrl} />
      <ActionHeader
        action="Get Subitems"
        actionDescription="Using the api to get all subitems of selected item"
      />

      <RenderItems
        itemsData={items}
        actionButtonContent="Get Subitems"
        action={
          subitemsBoardId
            ? (item) => {
                setSelectedItem({ id: item.id, name: item.name });
              }
            : null
        }
      />
      <Instructions
        paragraphs={getSubItemsConstants.getSubItemsInstructionsParagraphs}
        instructionsListItems={getSubItemsConstants.getSubItemsInstructionsListItems}
        linkToDocumentation={getSubItemsConstants.getSubItemsInstructionslinkToDocumentation}
      />
      {subitemsData.length > 0 && (
        <div className="overlay">
          <DialogContentContainer className="popup">
            <h3>Subitems of {selectedItem.name}</h3>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                setSelectedItem();
                setSubitemsData([]);
              }}
            />
            <RenderItems itemsData={subitemsData} />
          </DialogContentContainer>
        </div>
      )}
    </div>
  );
};

export default GetSubItems;
