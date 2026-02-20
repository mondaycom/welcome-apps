import React from "react";
import "./Instructions.scss";

const Instructions = ({ paragraphs, instructionsListItems, linkToDocumentation, customInstruction }) => {
  return (
    <div className="instructions">
      <h3>From the documentation</h3>
      {paragraphs.map((paragraph, i) => {
        return <p key={i}>{paragraph}</p>;
      })}

      <p>
        You can learn more{" "}
        <a href={linkToDocumentation} target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </p>
      <h3>Instructions</h3>
      <ol>
        {instructionsListItems.map((listItem, i) => {
          return <li key={i}>{listItem}</li>;
        })}
      </ol>
      {!customInstruction && <strong>Click on an item to try!</strong>}
    </div>
  );
};

export default Instructions;
