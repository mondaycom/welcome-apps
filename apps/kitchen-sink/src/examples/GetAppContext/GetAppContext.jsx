import React, { useState } from "react";
import './GetAppContext.scss';

import mondaySdk from "monday-sdk-js";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import CodeSamples from "../../constants/codeSamples";
import Button from "monday-ui-react-core/dist/Button";

const getContextConstants = {
  actionTitle: 'Get app context',
  actionSubtitle: `Use the SDK to get the app's context.`,
  instructionsParagraphs: [`Every app runs in a context - which feature it's connected to, which boards, etc. The monday.get('context') method gets the context that the app is running in.`],
  instructionslinkToDocumentation: `https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data`,
  instructionsListItems: [
      `Click the "Get context" button to retrieve the app's current context`,
      `The app calls monday.get('context') and prints it in the playground`,
      `Examine the context data to see what information your app can expect`,
      `Note: Try this example in other app features to see how the context changes!`,
  ],
  githubUrl: "Confirmation/Confirmation.jsx",
  codeSample: CodeSamples.GetAppContext.codeSample,
};

// @mondaycom-codesample-start
const monday = mondaySdk();

const GetAppContext = () => {
    const [showMessage, setShowMessage] = useState(0);
    const [contextDataString, setContextDataString] = useState('');

    const handleGetContext = async () => {
        const appContext = await monday.get('context');
        setContextDataString(JSON.stringify(appContext?.data, null, 2));
        setShowMessage(true);
    }

    return (
        <div className="get-context-container feature-container">
            {/* @mondaycom-codesample-skip-block-start */}
            <CodeBlock contentText={getContextConstants.codeSample} />
            <ActionHeader action={getContextConstants.actionTitle} actionDescription={getContextConstants.actionSubtitle} />
            <div className="get-context-content working-with-the-board-items playground">
                <h3 className="playground-header">Playground</h3>
                {/* @mondaycom-codesample-skip-block-end */}
                {!showMessage 
                    ? (<Button style={{ width: "30%", margin: "30px 0" }} onClick={handleGetContext}>
                    Show app context
                      </Button>)
                    : (<CodeBlock contentText={contextDataString} />)}
            </div>
            {/* @mondaycom-codesample-skip-block-start */}
            <Instructions
                paragraphs={getContextConstants.instructionsParagraphs}
                instructionsListItems={getContextConstants.instructionsListItems}
                linkToDocumentation={getContextConstants.instructionslinkToDocumentation}
            />
            {/* @mondaycom-codesample-skip-block-end */}
        </div>
    );
}
// @mondaycom-codesample-end

export default GetAppContext;