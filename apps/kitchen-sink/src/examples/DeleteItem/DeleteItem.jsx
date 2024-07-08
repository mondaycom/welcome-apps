import React from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import deleteItemConstants from "../DeleteItem/DeleteItemConstants";
import RenderItems from "../RenderItems/RenderItems.jsx";
// import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
// import { Loader } from "monday-ui-react-core";
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const DeleteItem = () => {
  const boardContext = useBoardContext();
  const { items, boardName, updateItems } = boardContext.state;

  const deleteItem = (item) => {
    monday
      .api(deleteItemConstants.deleteItemAndGetUpdatedBoardItemsQuery, {
        variables: { itemId: +item.id },
      })
      .then((res) => {
        updateItems({
          items: res.data.delete_item.board.items,
          boardName,
          updateItems,
        });
      });
  };

  return (
    <div className="delete-item-container feature-container">
      <ActionHeader
        action="Delete Item"
        actionDescription="Using the api to delete selected item"
      />

      <RenderItems
        itemsData={items}
        actionButtonContent="Delete me"
        action={(item) => {
          monday
            .execute("confirm", {
              message: `Are you sure you want to delete the item ${item.name} (This item will be actually deleted from you board)?`,
              confirmButton: "Delete",
              cancelButton: "Cancel",
              excludeCancelButton: false,
            })
            .then((res) => {
              res.data.confirm &&
                monday.execute("notice", {
                  message: "Item has been deleted successfully",
                  type: "success",
                  timeout: 10000,
                }) &&
                deleteItem(item);
            });
        }}
      />

      <CodeBlock contentUrl={deleteItemConstants.githubUrl} />
      <Instructions
        paragraphs={deleteItemConstants.deleteItemInstructionsParagraphs}
        instructionsListItems={
          deleteItemConstants.deleteItemInstructionsListItems
        }
        linkToDocumentation={
          deleteItemConstants.deleteItemInstructionslinkToDocumentation
        }
      />
    </div>
  );
};

export default DeleteItem;
