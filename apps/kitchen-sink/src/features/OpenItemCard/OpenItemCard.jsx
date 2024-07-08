import React from "react";
import "monday-ui-react-core/dist/main.css";
import "./OpenItemCard.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import openItemCardConstants from "./OpenItemCardConstants";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const OpenItemCard = () => {
  const boardContext = useBoardContext()
  const { items } = boardContext.state;
  return (
    <div className="open-item-card-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader action="Open Item Card" actionDescription="Using the SDK open card of selected item" />
      {/* @mondaycom-codesample-skip-block-end */}
      <RenderItems
        itemsData={items}
        actionButtonContent="Open Card"
        action={(item) => {
          monday.execute("openItemCard", { itemId: item.id });
        }}
      />
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.OpenItemCard.codeSample} />
      <Instructions
        paragraphs={openItemCardConstants.openItemCardInstructionsParagraphs}
        instructionsListItems={openItemCardConstants.openItemCardInstructionsListItems}
        linkToDocumentation={openItemCardConstants.openItemCardInstructionslinkToDocumentation}
        />
        {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end

export default OpenItemCard;
