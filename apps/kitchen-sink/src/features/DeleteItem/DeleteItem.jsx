import React, { useState, useEffect } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import deleteItemConstants from "../DeleteItem/DeleteItemConstants";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { getAllBoardItemsQuery } from "../../utils/boardUtil"; // TODO: move somewhere else
// import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { Loader } from 'monday-ui-react-core'

const monday = mondaySdk();

const DeleteItem = () => {
  const [state, setState] = useState({ items: [], updateItems: () => {}});
  const [isLoading, setIsLoading] = useState({isLoading : true});
  const { items, boardName, updateItems } = state;
  
  useEffect(() => {
    monday.listen("context", (res) => {
      console.log({context: res});
      if (res.data.boardIds.length === 0) {
        setIsLoading({isLoading: false});
      } else {
        setIsLoading({isLoading: true });
        monday
          .api(getAllBoardItemsQuery, {
            variables: {
              boardIds: res?.data?.boardIds,
              limit: 50,
            },
          })
          .then((itemsResponse) => {
            console.log({itemsResponse});
            // ----- GETS THE ITEMS OF THE BOARD -----
            setState({
              boardId: +res.data?.boardIds[0],
              boardName: itemsResponse?.data?.boards[0]?.name,
              items: itemsResponse.data.boards[0].items_page.items.map((item) => {
                return { id: item.id, name: item.name};
              }),
              updateItems: (state) => setState(state),
            });
            setIsLoading({isLoading: false});
          });
      }
    });
  }, []);

  const deleteItem = (item) => {
    monday
      .api(deleteItemConstants.deleteItemAndGetUpdatedBoardItemsQuery, {
        variables: { itemId: +item.id },
      })
      .then((res) => {
        updateItems({ items: res.data.delete_item.board.items, boardName, updateItems });
      });
  };

  return (
    <div className="delete-item-container feature-container">
      <ActionHeader action="Delete Item" actionDescription="Using the api to delete selected item" />

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
        instructionsListItems={deleteItemConstants.deleteItemInstructionsListItems}
        linkToDocumentation={deleteItemConstants.deleteItemInstructionslinkToDocumentation}
      />
    </div>
  );
};

export default DeleteItem;
