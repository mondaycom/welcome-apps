import React, { useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import Button from "monday-ui-react-core/dist/Button";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import "./Confirmation.scss";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import confirmationConstants from "./ConfirmationConstants";
import Instructions from "../../components/common/Instructions/Instructions";
import CodeSamples from "../../constants/codeSamples";

// @mondaycom-codesample-start
const monday = mondaySdk();

const Confirmation = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(0);

  const handleConfirmation = () => {
    monday
      .execute("confirm", {
        message: "Random question?",
        confirmButton: "Let's go!",
        cancelButton: "No way",
        excludeCancelButton: false,
      })
      .then((res) => {
        console.log(res.data)
        setConfirmed(res.data.confirm);
        setShowMessage(1);
        setTimeout(() => {
          setShowMessage(0);
        }, 2000);
      });
  };

  return (
    <div className="confirmation-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.Confirmation.codeSample} />
      <ActionHeader action="Confirmation Pop Up" actionDescription="Using the SDK, open a confirmation pop up" />
      <div className="confirmation-content working-with-the-board-items">
        <h3 className="playground-header">Playground</h3>
        {/* @mondaycom-codesample-skip-block-end */}
        {showMessage === 0 && <Button style={{ width: "30%", margin: "30px 0" }} onClick={handleConfirmation}>
          Click Me
        </Button>}
        {showMessage !== 0 && confirmed && <AttentionBox type="success" text="Confirmed" title="Lets go!" />}
        {showMessage !== 0 && !confirmed && <AttentionBox type="danger" text="Denied" title="No way" />}
      </div>
      {/* @mondaycom-codesample-skip-block-start */}
      <Instructions
        paragraphs={confirmationConstants.confirmationInstructionsParagraphs}
        instructionsListItems={confirmationConstants.confirmationInstructionsListItems}
        linkToDocumentation={confirmationConstants.confirmationInstructionslinkToDocumentation}
      />
      {/* @mondaycom-codesample-skip-block-end */}
    </div>
  );
};
// @mondaycom-codesample-end

export default Confirmation;
