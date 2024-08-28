import React, { useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import "./GetBoardItems.scss"
import mondaySdk from "monday-sdk-js";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeSamples from "../../constants/codeSamples";
import { Table, TableHeader, TableHeaderCell, TableRow, TableCell, TableBody, Label, Avatar, Icon } from "monday-ui-react-core";
import {File} from "monday-ui-react-core/icons"
import { useAppContext } from "../../hooks/UseAppContext.js";
import _ from "lodash";

const getBoardItemsConstants = {
    instructionsParagraphs: [
        `This app uses the "items_page" object to return the items from the current board.`,
        `It also gets the "columns" object to render the table column titles correctly.`,
        `The app uses the "Table" component from the monday vibe design system to display the data.`,
    ],
    instructionslinkToDocumentation: `https://api.developer.monday.com/docs/items-queries`,
    instructionsListItems: [
        `Check out the connected board's column values rendered in the playground.`, 
        `Read the code example for an example of the GraphQL query to get items from a board.`
    ],
    githubUrl: "GetBoardItems/GetBoardItems.jsx",
    codeSample: CodeSamples.GetBoardItems.codeSample,
};

// @mondaycom-codesample-start
const monday = mondaySdk();

// @mondaycom-codesample-skip-block-start 
const RenderItemsTable = ({ items, boardColumns, isLoading, isError }) => {
    const dataState = { isLoading, isError }

    return (
        <Table dataState={dataState} columns={boardColumns} withoutBorder>
            <TableHeader>
                {boardColumns.map((headerCell, index) => <TableHeaderCell key={index} title={headerCell.title} />)}
            </TableHeader>
            <TableBody>
                {items.map(rowItem =>
                    <TableRow key={rowItem.id}>
                        <TableCell key="name">{rowItem.name}</TableCell>
                        {rowItem?.column_values.map(elt =>
                            {if (elt.type === 'status') {
                                return <TableCell key={elt.id}>
                                    {elt.text && <Label text={elt.text} color={Label.colors.PRIMARY} />}
                                </TableCell>
                            } if (elt.type === 'people') {
                                return <TableCell key={elt.id}>
                                    {elt.text && <Avatar size={Avatar.sizes.SMALL} backgroundColor={_.sample(Avatar.colors)} text={elt.text.substring(0,1)} />}
                                </TableCell>
                            } if (elt.type === 'file') {
                                return <TableCell key={elt.id}>
                                    {elt.text && <Icon icon={File} />}
                                </TableCell>
                            } else {
                                return <TableCell key={elt.id}>{elt.text}</TableCell>
                            }}
                        )}
                    </TableRow>
                
                )}
            </TableBody>
        </Table>
    )
}

// @mondaycom-codesample-skip-block-end 
const GetBoardItems = () => {
    const appContext = useAppContext();
    const [items, setItems] = useState([])
    const [boardColumns, setBoardColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    let currentBoard = appContext?.data?.boardIds?.at(0) ?? appContext?.data?.boardId ?? null;

    useEffect(() => {
        if (currentBoard) { // only get items after context has been fetched
            monday.api(
                `query ($boardId: [ID!]) {
                    boards(ids: $boardId) {
                        id
                        columns {
                            id
                            title
                            type
                        }
                        items_page {
                            items {
                                id
                                name
                                column_values {
                                    id
                                    text
                                    value
                                    type
                                }
                            }
                        }
                    }
                }`,
                {
                    variables: {
                        boardId: currentBoard,
                    }
                })
                .then((res) => {
                    setBoardColumns(res.data.boards[0].columns);
                    setItems(res.data.boards[0].items_page.items);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsError(true);
                    console.log({ err });
                });
        }
    }, [currentBoard])

    return (
        <div className="get-items-container feature-container">
            {/* @mondaycom-codesample-skip-block-start */}
            <ActionHeader
                action="Get board items"
                actionDescription="Using the Platform API to get item data"
            />
            <div className="playground working-with-the-board-items">
            {/* @mondaycom-codesample-skip-block-end */}
            <RenderItemsTable
                items={items}
                boardColumns={boardColumns}
                isLoading={isLoading}
                isError={isError}
            />
            {/* @mondaycom-codesample-skip-block-start */}
            </div>
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
