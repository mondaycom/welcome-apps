import React, { useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
// import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
// import { Loader } from "monday-ui-react-core";
import { useBoardContext } from "../../hooks/UseBoardContext.js";
import CodeSamples from "../../constants/codeSamples";
import { useAppContext } from "../../hooks/UseAppContext.js";
import _, { filter } from "lodash";

const getBoardItemsConstants = {
    deleteItemAndGetUpdatedBoardItemsQuery: `mutation ($itemId: ID!) {
      delete_item(item_id: $itemId) {
        board {
          items_page {
            items {
              id
              name
            }
          }
        }
      }
    }
    `,
    instructionsParagraphs: [
        `This query uses "items_page" to return the items from the current board.`, 
        `It filters dynamically based on the state of the board filter.`,
        `This example uses the "rules" argument on the "items_page" query`
    ],
    instructionslinkToDocumentation: `https://api.developer.monday.com/docs/items-queries`,
    instructionsListItems: [`Add filter rules using the board filter`, `See the items in the playground change`],
    githubUrl: "GetBoardItems/GetBoardItems.jsx",
    codeSample: CodeSamples.GetBoardItems.codeSample,
};

// @mondaycom-codesample-start
const monday = mondaySdk();

const GetBoardItems = () => {
    const appContext = useAppContext();
    const [filterState, setFilterState] = useState()
    const [items, setItems] = useState([])
    let currentBoard = appContext?.data?.boardIds[0] ?? null;
    let filterRules = filterState?.data?.rules ?? [];

    const handleFilterChange = async (evt) => {
        setFilterState(evt);
    }

    const debouncedHandleFilterChange = _.debounce(handleFilterChange, 500);

    useEffect(() => {
        const filterListener = monday.listen('filter', debouncedHandleFilterChange)
    }, [])

    useEffect(() => {
        if (currentBoard) { // only get items after context has been fetched
            console.time('get_items')
            const res = monday.api(`query ($boardId: [ID!], $rules:[ItemsQueryRule!]) {
                                        boards(ids: $boardId) {
                                            id
                                            items_page (query_params: { rules: $rules}) {
                                                items {
                                                    id
                                                    name
                                                }
                                            }
                                        }
                                    }`,
                {
                    variables: {
                        boardId: currentBoard, 
                        rules: filterRules
                    }
                })
                .then((res) => {
                    setItems(res.data.boards[0].items_page.items)
                });
        }
    }, [currentBoard, filterRules])

    return (
        <div className="get-items-container feature-container">
            {/* @mondaycom-codesample-skip-block-start */}
            <ActionHeader
                action="Get board items"
                actionDescription="Using the api to get and filter items from the board"
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
export default GetBoardItems;
