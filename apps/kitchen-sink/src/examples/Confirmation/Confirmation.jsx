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

const AttentionBoxSwitcher = ({ confirmed }) => {
  return (
    confirmed ?
      <AttentionBox type="success" title="Confirmed" text="User accepted the confirm dialog" /> 
      : <AttentionBox type="danger" title="Denied" text="User declined the confirm dialog" />
  )
}

const Confirmation = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleConfirmation = () => {
    monday
      .execute("confirm", {
        message: "Do you confirm?",
        confirmButton: "Yes",
        cancelButton: "No",
        excludeCancelButton: false,
      })
      .then((res) => {
        console.log(res.data)
        setConfirmed(res.data.confirm);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2000);
      });
  };

  return (
    <div className="confirmation-container feature-container">
      {/* @mondaycom-codesample-skip-block-start */}
      <CodeBlock contentText={CodeSamples.Confirmation.codeSample} />
      <ActionHeader action="Confirmation Pop Up" actionDescription="Using the SDK, open a confirmation pop up" />
      <div className="confirmation-content working-with-the-board-items playground">
        <h3 className="playground-header">Playground</h3>
        <div className="example">
          {/* @mondaycom-codesample-skip-block-end */}
          {!showMessage
            ? <Button onClick={handleConfirmation}>
              Click Me
            </Button>
            : <AttentionBoxSwitcher confirmed={confirmed} />}
          {/* @mondaycom-codesample-skip-block-start */}
        </div>
      </div>
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
