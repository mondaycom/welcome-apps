import React, { useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
// import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
// import { Loader } from "monday-ui-react-core";
import CodeSamples from "../../constants/codeSamples";
import { Table, TableHeader, TableHeaderCell, TableRow, TableCell, TableBody, Label } from "monday-ui-react-core";

const getWorkspacesConstants = {
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

/**
 * Renders a table with workspace details in it
 * @param {workspaces} - list of workspaces, containing 
 *                       id, is_default_workspace, name, 
 *                       kind, users_subscribers (up to 500)
 */
const RenderWorkspaceTable = ({ workspaces, isLoading, isError }) => {
    const dataState = { isLoading, isError }
    const columns = [
        {
            id: 'id',
            title: 'ID',
            width: 100,
        },
        {
            id: 'name',
            title: 'Name'
        },
        {
            id: 'kind',
            title: 'Kind',
            width: 150,
        },
        {
            id: 'num_subscribers',
            title: '# of Subscribers'
        },
    ];
    return (
        <Table dataState={dataState} columns={columns}>
            <TableHeader>
                {columns.map((headerCell, index) => <TableHeaderCell key={index} title={headerCell.title} />)}
            </TableHeader>
            <TableBody>
                {workspaces.map(rowItem => <TableRow key={rowItem.id}>
                    <TableCell>{rowItem.id}</TableCell>
                    <TableCell>{rowItem.name}</TableCell>
                    <TableCell>
                        <Label text={rowItem.kind} color={Label.colors.POSITIVE} isAnimationDisabled />
                    </TableCell>
                    <TableCell>{rowItem.users_subscribers.length}</TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    )
}

const GetWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        monday.api(
            `query {
            workspaces (limit:100) {
                id
                is_default_workspace
                name
                kind
                users_subscribers (limit:500) {
                    id  
                }
            }
        } `)
            .then((res) => {
                console.log({ res });
                setWorkspaces(res.data.workspaces);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsError(true);
            });
    }, [workspaces])

    return (
        <div className="get-workspaces-container feature-container">
            {/* @mondaycom-codesample-skip-block-start */}
            <ActionHeader
                action="Get workspaces"
                actionDescription="List the workspaces in the account"
            />
            {/* @mondaycom-codesample-skip-block-end */}
            <div className="playground">
            <RenderWorkspaceTable
                workspaces={workspaces}
                isLoading={isLoading}
                isError={isError}
            />
            </div>
            {/* @mondaycom-codesample-skip-block-start */}
            <CodeBlock contentText={getWorkspacesConstants.codeSample} />
            <Instructions
                paragraphs={getWorkspacesConstants.instructionsParagraphs}
                instructionsListItems={
                    getWorkspacesConstants.instructionsListItems
                }
                linkToDocumentation={
                    getWorkspacesConstants.instructionslinkToDocumentation
                }
            />
            {/* @mondaycom-codesample-skip-block-end */}
        </div>
    );
};
// @mondaycom-codesample-end
export default GetWorkspaces;
