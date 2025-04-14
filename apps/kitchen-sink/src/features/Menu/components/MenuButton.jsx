import React from "react";
import "./MenuButton.scss";
import PropTypes from "prop-types";

const StackButton = ({image, background, title, onPress }) => {
  return (
    <div onClick={onPress} className="menuItemContainer" >
      <div style={{ backgroundColor: background }} className="background">

      <img src={image} className='item-icon' alt="icon"  />
      </div>
      <div className="item-title">{title}</div>
    </div>
  );
};

StackButton.propTypes = {
  image: PropTypes.string,
  background: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

export default StackButton;
