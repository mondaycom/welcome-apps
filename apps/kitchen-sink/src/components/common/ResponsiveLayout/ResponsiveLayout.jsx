import React from "react";
import CodeBlock from "../CodeBlock/CodeBlock";
import Instructions from "../Instructions/Instructions";
import ActionHeader from "../ActionHeader/ActionHeader";

const ResponsiveLayout = ({actionName, actionDescription, ExampleComponent, codeExample, documentationParagraphs, documentationListItems, documentationLink}) => {
    console.log({actionName, actionDescription, ExampleComponent, codeExample, documentationParagraphs, documentationListItems, documentationLink})
    return (
        <div className="feature-container">
            <ActionHeader action={actionName} actionDescription={actionDescription} />
            <ExampleComponent />
            <CodeBlock contentText={codeExample} />
            <Instructions 
                paragraphs={documentationParagraphs}
                instructionListItems={documentationListItems}
                linkToDocumentation={documentationLink}
            />
        </div>
    )
}

export default ResponsiveLayout;