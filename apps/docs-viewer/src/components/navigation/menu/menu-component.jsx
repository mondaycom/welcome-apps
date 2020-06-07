import React from "react";
import onClickOutside from "react-onclickoutside";
import { ReactComponent as DeleteIcon } from "../../../icons/v2-delete-line.svg";
import { ReactComponent as EditIcon } from "../../../icons/dapulse-edit.svg";
import "./menu-component.scss";

const DeleteIconComponent = function (props) {
  return <DeleteIcon className="delete-icon" />;
};

const EditIconComponent = function (props) {
  return <EditIcon className="edit-icon" />;
};

class MenuComponent extends React.Component {
  handleClickOutside = (evt) => {
    const { closeMenuFunction } = this.props;

    if (closeMenuFunction) closeMenuFunction();
  };

  onRemoveItemClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { onRemoveItemClick } = this.props;
    if (onRemoveItemClick) onRemoveItemClick();
  };

  onEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { onEditItemClick } = this.props;
    if (onEditItemClick) onEditItemClick();
  };

  render() {
    return (
      <div className="menu-component">
        <div className="menu-item" onClick={this.onEditClick}>
          <div className="icon-container">
            <EditIconComponent />
          </div>
          Edit
        </div>
        <div className="menu-item" onClick={this.onRemoveItemClick}>
          <div className="icon-container">
            <DeleteIconComponent />
          </div>
          Delete
        </div>
      </div>
    );
  }
}

export default onClickOutside(MenuComponent);
