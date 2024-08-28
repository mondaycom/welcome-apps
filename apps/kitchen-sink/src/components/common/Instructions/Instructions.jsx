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
        <a href={linkToDocumentation} target="_blank" rel="noopener noreferrer">
          Learn more in our documentation here.
        </a>
      </p>
      <h3>Instructions</h3>
      <ol>
        {instructionsListItems.map((listItem, i) => {
          return <li key={i}>{listItem}</li>;
        })}
      </ol>
    </div>
  );
};

export default Instructions;
