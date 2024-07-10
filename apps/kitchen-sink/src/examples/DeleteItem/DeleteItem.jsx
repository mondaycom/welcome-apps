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
import CodeSamples from "../../constants/codeSamples";
// @mondaycom-codesample-start
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
          items: res.data.delete_item.board.items_page.items,
          boardName,
          updateItems,
        });
      });
  };

  return (
    <div className="delete-item-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader
        action="Delete Item"
        actionDescription="Using the api to delete selected item"
      />
      {/* @mondaycom-codesample-skip-block-end */}
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

    {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.DeleteItem.codeSample} />
      <Instructions
        paragraphs={deleteItemConstants.deleteItemInstructionsParagraphs}
        instructionsListItems={
          deleteItemConstants.deleteItemInstructionsListItems
        }
        linkToDocumentation={
          deleteItemConstants.deleteItemInstructionslinkToDocumentation
        }
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end
export default DeleteItem;
