import React from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import Button from "monday-ui-react-core/dist/Button";
import "./Notice.scss";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import noticeConstants from "./NoticeConstants";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
const monday = mondaySdk();

const Notice = () => {
  const handleNotice = (type, text) => {
    monday.execute("notice", {
      message: `${text} message`,
      type: type,
      timeout: 3000,
    });
  };

  const notices = [
    {
      text: "Success",
      type: "success",
      color: "positive",
    },
    {
      text: "Info",
      type: "info",
      color: "primary",
    },
    {
      text: "Error",
      type: "error",
      color: "negative",
    },
  ]

  return (
    <div className="notice-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <ActionHeader action="Notice Pop Up" actionDescription="Using the SDK, open a notice pop up" />
      {/* @mondaycom-codesample-skip-block-end */}
      <div className="notice-content working-with-the-board-items playground">
        {/* @mondaycom-codesample-skip-block-start */}
        <h3 className="playground-header">Playground</h3>
        {/* @mondaycom-codesample-skip-block-end */}
        {notices.map(({ type, text, color }) => (
          <Button className="confirm-button" color={color} onClick={() => handleNotice(type, text)}>
            {text} Notice
          </Button>
        ))}
      </div>
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.Notice.codeSample} />
      <Instructions
        paragraphs={noticeConstants.noticeInstructionsParagraphs}
        instructionsListItems={noticeConstants.noticeInstructionsListItems}
        linkToDocumentation={noticeConstants.noticeInstructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end

export default Notice;
