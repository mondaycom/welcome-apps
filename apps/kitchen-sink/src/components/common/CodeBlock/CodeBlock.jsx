//TODO: check dependencies of CodeBlock component

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import nightOwl from "prism-react-renderer/themes/nightOwl";
import "./CodeBlock.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faExpandAlt, faCompressAlt } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import mondaySdk from "monday-sdk-js";
import axios from "../../../utils/axiosConfig";

const Pre = ({ children, className }) => {
  return <pre className={className}>{children}</pre>;
};
const Line = ({ children }) => {
  return <div className="line">{children}</div>;
};
const LineNo = ({ children }) => {
  return <span className="lineNo">{children}</span>;
};
const LineContent = ({ children }) => {
  return <span className="lineContent">{children}</span>;
};

const monday = mondaySdk();

const popNotice = () => {
  monday.execute("notice", {
    message: "Copied to clipboard!",
    type: "success",
    timeout: 3000,
  });
};

const CodeBlock = ({ contentUrl, contentText }) => {
  const [content, setContent] = useState("Loading...");
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  useEffect(() => {
    if (contentUrl) getContentUrl();
    else if (contentText) setContent(contentText);
    else setContent("No code snippet provided.")
  }, [contentUrl]);

  const getContentUrl = async () => {
    try {
      const { data } = await axios.get(contentUrl);
      setContent(data);
    } catch (error) {
      setContent("An error occurred while fetching the code snippet, please try again later");
    }
  };
  return (
    <Highlight {...defaultProps} theme={nightOwl} code={content.trim()} language="js">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={`pre ${isFullScreenMode ? "fullscreen" : ""}`} style={style}>
          <CopyToClipboard onCopy={popNotice} text={content}>
            <FontAwesomeIcon icon={faCopy} />
          </CopyToClipboard>
          <FontAwesomeIcon
            icon={isFullScreenMode ? faCompressAlt : faExpandAlt}
            onClick={() => setIsFullScreenMode((prevState) => !prevState)}
          />
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
