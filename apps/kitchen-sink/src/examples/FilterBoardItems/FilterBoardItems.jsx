import React, { useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeSamples from "../../constants/codeSamples";
import { useAppContext } from "../../hooks/UseAppContext.js";
import _ from "lodash";

const filterBoardItemsConstants = {
    instructionsParagraphs: [
        `This example uses the "rules" argument on the "items_page" query to filter data.`,
        `The "items_page" query takes an optional array of 'rules', to enable filtering.`, 
        `The monday.listen('filter') method returns a list of filter rules, in the same format.`,
        `This example shows how you can combine the principles to get filter items dynamically based on the user's input.`,
    ],
    instructionslinkToDocumentation: `https://developer.monday.com/api-reference/reference/other-types#itemsqueryrule`,
    instructionsListItems: [
        `Add filter rules using the board filter.`, 
        `The app passes these rules to the 'items_page' API query.`, 
        `The resulting items are listed on the board.`,
        `The sample debounces the filter results to prevent making concurrent API calls.`,
    ],
    githubUrl: "FilterBoardItems/FilterBoardItems.jsx",
    codeSample: CodeSamples.FilterBoardItems.codeSample,
};

// @mondaycom-codesample-start
const monday = mondaySdk();

const FilterBoardItems = () => {
    const [items, setItems] = useState([])
    const appContext = useAppContext();
    let currentBoard = appContext?.data?.boardIds?.at(0) ?? appContext?.data?.boardId ?? null;
    const [filterState, setFilterState] = useState()
    let filterRules = filterState?.data?.rules ?? [];

    const handleFilterChange = async (evt) => {
        setFilterState(evt);
    }

    const debouncedHandleFilterChange = _.debounce(handleFilterChange, 1000);

    useEffect(() => {
        const filterListener = monday.listen('filter', debouncedHandleFilterChange)
        return () => {
            filterListener(); // unsubscribe from listener
        }
    }, [])

    useEffect(() => {
        if (currentBoard) { // only get items after context has been fetched
            monday.api(
                `query ($boardId: [ID!], $rules:[ItemsQueryRule!]) {
                    boards(ids: $boardId) {
                        id
                        items_page (query_params: { rules: $rules }) {
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
                })
                .catch((err) => {
                    console.error({err});
                });
        }
    }, [currentBoard, filterRules])

    return (
        <div className="feature-container">
            {/* @mondaycom-codesample-skip-block-start */}
            <ActionHeader
                action="Filter board items"
                actionDescription="Using API to filter items from the board"
            />
            <div className="playground working-with-the-board-items no-border">
            {/* @mondaycom-codesample-skip-block-end */}
            <RenderItems
                itemsData={items}
            />
            {/* @mondaycom-codesample-skip-block-start */}
            </div>
            <CodeBlock contentText={filterBoardItemsConstants.codeSample} />
            <Instructions
                paragraphs={filterBoardItemsConstants.instructionsParagraphs}
                instructionsListItems={
                    filterBoardItemsConstants.instructionsListItems
                }
                linkToDocumentation={
                    filterBoardItemsConstants.instructionslinkToDocumentation
                }
            />
            {/* @mondaycom-codesample-skip-block-end */}
        </div>
    );
};
// @mondaycom-codesample-end
export default FilterBoardItems;
