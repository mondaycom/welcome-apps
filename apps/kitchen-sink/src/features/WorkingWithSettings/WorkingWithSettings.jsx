import React, { useState, useEffect, useContext } from "react";
import "monday-ui-react-core/dist/main.css";
import "./WorkingWithSettings.scss";
import mondaySdk from "monday-sdk-js";
import workingWithSettingsConstants from "./WorkingWithSettingsConstants.js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";

const monday = mondaySdk();

const WorkingWithSettings = () => {
  const { items } = useContext(Context);

  const [settings, setSettings] = useState({});

  useEffect(() => {
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
  }, []);

  return (
    <div className="working-with-settings-container feature-container">
      <ActionHeader
        action={settings.titleContent || workingWithSettingsConstants.DEFAULT_SETTINGS_VALUES.titleContent}
        actionDescription={
          settings.actionDescription || workingWithSettingsConstants.DEFAULT_SETTINGS_VALUES.actionDescription
        }
        backgroundColor={settings.backgroundColor}
      />

      {settings.toDisplayItems && <RenderItems itemsData={items} />}
      <CodeBlock contentUrl={workingWithSettingsConstants.githubUrl} />

      <Instructions
        paragraphs={workingWithSettingsConstants.workingWithSettingsInstructionsParagraphs}
        instructionsListItems={workingWithSettingsConstants.workingWithSettingsInstructionsListItems}
        linkToDocumentation={workingWithSettingsConstants.workingWithSettingsInstructionslinkToDocumentation}
      />
    </div>
  );
};

export default WorkingWithSettings;
