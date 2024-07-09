import React, { useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import Button from "monday-ui-react-core/dist/Button";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
// import "./Notice.scss";
import openSettingsPaneConstants from "./OpenSettingsPaneConstants";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
const monday = mondaySdk();

const OpenSettingsPane = () => {
    const [isPaneOpen, setIsPaneOpen] = useState(false);

  const handleOpenSettings = (type, text) => {
    monday.execute("openSettings")
    setIsPaneOpen(true);
  };
  const handleCloseSettings = (type, text) => {
    monday.execute("closeSettings")
    setIsPaneOpen(false);
  };

  return (
    <div className="open-settings-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader action="Open Settings Pane" actionDescription="Using the SDK, open a notice pop up" />
      {/* @mondaycom-codesample-skip-block-end */}
      <div className="open-settings working-with-the-board-items">
        {/* @mondaycom-codesample-skip-block-start */}
        <h3 className="playground-header">Playground</h3>
        {/* @mondaycom-codesample-skip-block-end */}
          {!isPaneOpen ? <Button onClick={handleOpenSettings}>
            Open settings pane
          </Button>
          : <Button onClick={handleCloseSettings}>
          Close settings pane
            </Button>}
      </div>
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples?.OpenSettingsPane?.codeSample} />
      <Instructions
        paragraphs={openSettingsPaneConstants?.instructionsParagraphs}
        instructionsListItems={openSettingsPaneConstants?.instructionsListItems}
        linkToDocumentation={openSettingsPaneConstants?.githubUrl}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end

export default OpenSettingsPane;
