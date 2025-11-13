import React, { useContext } from "react";
import "monday-ui-react-core/dist/main.css";
import "./OpenItemCard.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import openItemCardConstants from "./OpenItemCardConstants";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";

const monday = mondaySdk();

const OpenItemCard = () => {
  const { items } = useContext(Context);
  return (
    <div className="open-item-card-container feature-container">
      <ActionHeader action="Open Item Card" actionDescription="Using the SDK open card of selected item" />

      <RenderItems
        itemsData={items}
        actionButtonContent="Open Card"
        action={(item) => {
          monday.execute("openItemCard", { itemId: item.id });
        }}
      />
      <CodeBlock contentUrl={openItemCardConstants.githubUrl} />
      <Instructions
        paragraphs={openItemCardConstants.deleteItemInstructionsParagraphs}
        instructionsListItems={openItemCardConstants.deleteItemInstructionsListItems}
        linkToDocumentation={openItemCardConstants.deleteItemInstructionslinkToDocumentation}
      />
    </div>
  );
};

export default OpenItemCard;
