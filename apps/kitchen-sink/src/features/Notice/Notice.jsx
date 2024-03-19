import React from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import Button from "monday-ui-react-core/dist/Button";
import "./Notice.scss";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import noticeConstants from "./NoticeConstants";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";

const monday = mondaySdk();

const Notice = () => {
  const handleNotice = (type, text) => {
    monday.execute("notice", {
      message: `${text} message`,
      type: type,
      timeout: 3000,
    });
  };

  return (
    <div className="notice-container feature-container">
      <ActionHeader action="Notice Pop Up" actionDescription="Using the SDK, open a notice pop up" />
      <div className="notice-content working-with-the-board-items">
        <h3 className="playground-header">Playground</h3>
        {noticeConstants.notices.map(({ type, text, color }) => (
          <Button color={color} onClick={() => handleNotice(type, text)}>
            {text} Notice
          </Button>
        ))}
      </div>
      <CodeBlock contentUrl={noticeConstants.githubUrl} />
      <Instructions
        paragraphs={noticeConstants.noticeInstructionsParagraphs}
        instructionsListItems={noticeConstants.noticeInstructionsListItems}
        linkToDocumentation={noticeConstants.noticeInstructionslinkToDocumentation}
      />
    </div>
  );
};

export default Notice;
