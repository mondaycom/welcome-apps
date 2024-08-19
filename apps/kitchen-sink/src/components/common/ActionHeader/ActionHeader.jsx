import React, { useRef } from "react";
import "monday-ui-react-core/dist/main.css";
import { IconButton } from "monday-ui-react-core";
import { Heading } from "monday-ui-react-core/next";
import "./ActionHeader.scss";
import { NavigationChevronLeft } from "monday-ui-react-core/icons";
import randomColorGenerator from "../../../utils/randomColorGenerator";

const ActionHeader = ({ action, actionDescription, backgroundColor }) => {
  const initialRandomColor = useRef(randomColorGenerator());

  return (
    <div
      className="action-header-container"
      // style = {{"background-color": "var(--egg-yolk)"}}
    >
      <div className="back-arrow">
        <IconButton className="back-arrow" icon={NavigationChevronLeft} onClick={() => {
          window.history.back()
        }}/>
        </div>
        <div className="headers">
        <div className="main-title">
        <Heading>{action}</Heading>
        </div>
        <Heading type="h3">{actionDescription}</Heading>
      </div>
    </div>
  );
};

export default ActionHeader;
