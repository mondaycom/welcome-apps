import React, { useEffect, useReducer } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
// import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeSamples from "../../constants/codeSamples";
import { useAppContext } from "../../hooks/UseAppContext.js";

const getBoardItemsConstants = {
  instructionsParagraphs: [
    `This query uses "items_page" to return the items from the current board.`,
    `It also uses the "next_items_page" object to get a page for a given cursor.`,
    `It gets the items 1 at a time to demonstrate cursor pagination.`,
  ],
  instructionslinkToDocumentation: `https://developer.monday.com/api-reference/reference/items-page#cursor-based-pagination-using-next_items_page`,
  instructionsListItems: [
    `When the app is rendered, it calls 'items_page' to retrieve the first page of items.`,
    `If another page exists, the cursor will be a string.`,
    `The app calls the "next_items_page object to get the next page of items.`,
    `It continues to call the API until the cursor is null.`,
    `The example uses a reducer function to update the items state. Check code example to see this logic in action.`,
  ],
  githubUrl: "GetBoardItems/GetBoardItems.jsx",
  codeSample: CodeSamples.Pagination.codeSample,
};

// @mondaycom-codesample-start
const monday = mondaySdk();

function itemsReducer(items, action) {
  if (action.type === 'added') {
    return [...items, ...action.itemsToAdd];
  }
}

const Pagination = () => {
  const appContext = useAppContext();
  const [items, dispatch] = useReducer(itemsReducer, [])
  let currentBoard = appContext?.data?.boardIds?.at(0) ?? appContext?.data?.boardId ?? null;

  useEffect(() => {
    if (currentBoard) {
      async function getItemsWithPagination() {
        const boardIds = currentBoard;

        // get first page of items
        var items_page = await monday.api(`
          query ($boardIds:[ID!]){
            boards (ids:$boardIds) { 
              items_page (limit:1) {
                cursor
                items {
                  name
                  id
                }
              } 
            } 
          }`, { variables: { boardIds } });

        // dispatch changes to items state
        let itemsToAdd = items_page.data.boards[0].items_page.items;
        dispatch({
          type: 'added',
          itemsToAdd
        })

        // set cursor & increment page
        var cursor = items_page.data.boards[0].items_page.cursor;

        // if cursor exists, retrieve next page
        while (cursor) {
          items_page = await monday.api(`
            query ($cursor:String!){
                next_items_page (limit:1, cursor:$cursor) {
                  cursor
                  items {
                    name
                    id
                  }
              } 
            }`, { variables: { cursor } });
          let itemsToAdd = items_page.data.next_items_page.items;
          dispatch({
            type: 'added',
            itemsToAdd
          });
          cursor = items_page.data.next_items_page.cursor;
        }

      }
      try {
        getItemsWithPagination();
      } catch (err) {
        console.error(err);
      }
    }
  }, [currentBoard])

  return (
    <div className="get-items-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader
        action="Pagination"
        actionDescription="Use cursor pagination to get items from the board efficiently"
      />
      {/* @mondaycom-codesample-skip-block-end */}
      <RenderItems
        itemsData={items}
      />
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={getBoardItemsConstants.codeSample} />
      <Instructions
        paragraphs={getBoardItemsConstants.instructionsParagraphs}
        instructionsListItems={
          getBoardItemsConstants.instructionsListItems
        }
        linkToDocumentation={
          getBoardItemsConstants.instructionslinkToDocumentation
        }
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end
export default Pagination;