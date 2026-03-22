import React, { useRef } from "react";
import "monday-ui-react-core/dist/main.css";
import "./ActionHeader.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import randomColorGenerator from "../../../utils/randomColorGenerator";

const ActionHeader = ({ action, actionDescription, backgroundColor }) => {
  const initialRandomColor = useRef(randomColorGenerator());

  return (
    <div
      className="action-header-container"
      style={{ backgroundColor: backgroundColor || `rgb${initialRandomColor.current}` }}
    >
      <div className="headers">
        <h2 className="board-name ellipsis">
          <FontAwesomeIcon
            icon={faAngleLeft}
            onClick={() => {
              window.history.back();
            }}
          />
          {action}
        </h2>
        <h5 className="ellipsis">{actionDescription}</h5>
      </div>
    </div>
  );
};

export default ActionHeader;
