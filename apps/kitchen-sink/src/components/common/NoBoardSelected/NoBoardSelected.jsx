import React, { useContext } from "react";
import { Context } from "../../context/ContextProvider";
import Loader from "monday-ui-react-core/dist/Loader";
import EmptyBoardSVG from "../../../assets/icons/empty-board.svg";
import ArrowImage from "../../../assets/icons/right-up-arrow.png";

const NoBoardSelected = () => {
  const { boardName, isLoading } = useContext(Context);
  if (isLoading) {
    return (
      <div style={{ height: 48, width: 48, margin: "auto" }}>
        <Loader />
      </div>
    );
  } else if (!boardName) {
    return (
      <div className="empty-board-container">
        <img className="empty-board-image" src={EmptyBoardSVG} alt="" />
        <h2>No board selected</h2>
        <div className="chooseBoardContainer">
          <h4>Please add items or select other board.</h4>
          <img className="pointer-image" src={ArrowImage} alt="" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="empty-board-container">
        <img className="empty-board-image" src={EmptyBoardSVG} alt="" />
        <h2>Board is empty</h2>
        <h4>Please add items or select other board.</h4>
      </div>
    );
  }
};

export default NoBoardSelected;
