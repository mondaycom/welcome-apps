import React from "react";
import "monday-ui-react-core/dist/main.css";
import "./CreateItemCard.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock.jsx";
import Instructions from "../../components/common/Instructions/Instructions.jsx";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader.jsx";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const createItemCardConstants = {
    instructionsParagraphs: [
      `Opens a modal to create a new item on the board.`, 
      `Useful when you want users to create items without building the logic yourself.`, 
    ],
    instructionslinkToDocumentation: `https://github.com/mondaycom/monday-sdk-js#mondayexecutetype-params`,
    instructionsListItems: [
      `Select any item and click "Create new item"`,
      `The app will call monday.execute("openCreateItemDialog") with the current board's ID.`,
      `Fill out the item's column values, and the new item will appear at the top of the board.`,
    ],
    codeSample: CodeSamples.CreateItemCard.codeSample,
  };
  

const monday = mondaySdk();

const CreateItemCard = () => {
  const boardContext = useBoardContext()
  const { items, boardId } = boardContext.state;
  return (
    <div className="create-item-card-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader action="Create Item Card" actionDescription="Using the SDK open card to create a new item" />
      {/* @mondaycom-codesample-skip-block-end */}
      <RenderItems
        itemsData={items}
        actionButtonContent="Create New Item"
        action={(item) => {
          monday.execute("openCreateItemDialog", { boardId });
        }}
      /> 
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.CreateItemCard.codeSample} />
      <Instructions
        paragraphs={createItemCardConstants.instructionsParagraphs}
        instructionsListItems={createItemCardConstants.instructionsListItems}
        linkToDocumentation={createItemCardConstants.instructionslinkToDocumentation}
        />
        {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end

export default CreateItemCard;
