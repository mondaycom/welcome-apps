import React from "react";
import MenuComponent from "../menu/menu-component";
import { ReactComponent as EllipsisIcon } from "../../../icons/v2-ellipsis.svg";
import { ReactComponent as FigmaIcon } from "../../../icons/Figma.svg";
import { ReactComponent as OfficeIcon } from "../../../icons/Office.svg";
import { ReactComponent as DriveIcon } from "../../../icons/Drive.svg";
import { ReactComponent as OtherIcon } from "../../../icons/Others.svg";
import { TYPES } from "../../../services/docs-service";
import classnames from "classnames";
import AddFileDialogComponent from "../top-bar/add-file-dialog/add-file-dialog-component";
import "./file-item-component.scss";

const IconComponent = function (props) {
  const { type } = props;
  const ChosenIconComponent = {
    ellipsis: EllipsisIcon,
    [TYPES.GOOGLE_DRIVE]: DriveIcon,
    [TYPES.ONEDRIVE]: OfficeIcon,
    [TYPES.FIGMA]: FigmaIcon,
    [TYPES.OTHER]: OtherIcon,
  }[type];

  return <ChosenIconComponent className={classnames("app-icon", { "elipssis-icon": type === "ellipsis" })} />;
};

export default class FileItemComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { optionsMenuOpen: false, isItemHovered: false, isAddFileDialogOpen: false };
  }

  onClick = () => {
    const { fileItem, onClick } = this.props;
    onClick(fileItem);
  };

  onMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { optionsMenuOpen } = this.state;
    this.setState({ optionsMenuOpen: !optionsMenuOpen });
  };

  onMenuOutsideClick = () => {
    this.setState({ optionsMenuOpen: false });
  };

  onRemoveItemClick = () => {
    const { onRemoveItemClick, fileItem } = this.props;

    if (onRemoveItemClick) {
      onRemoveItemClick(fileItem);
    }

    this.setState({ optionsMenuOpen: false });
  };

  onHover = () => {
    this.setState({ isItemHovered: true });
  };

  onBlur = () => {
    this.setState({ isItemHovered: false });
  };

  onAddFileDialogClose = () => {
    this.setState({ isAddFileDialogOpen: false });
  };

  onEditItemClick = () => {
    this.setState({ optionsMenuOpen: false, isAddFileDialogOpen: true });
  };

  render() {
    const { fileItem, selectedItemId, onAfterItemAdded } = this.props;
    const { optionsMenuOpen, isItemHovered, isAddFileDialogOpen } = this.state;
    const isSelectedItem = fileItem.id === selectedItemId;

    return (
      <div
        className={classnames("file-item-component", { selected: isSelectedItem })}
        onMouseEnter={this.onHover}
        onMouseLeave={this.onBlur}
        onClick={this.onClick}
      >
        {isAddFileDialogOpen && (
          <AddFileDialogComponent
            onClose={this.onAddFileDialogClose}
            onAfterItemAdded={onAfterItemAdded}
            name={fileItem.name}
            id={fileItem.id}
            url={fileItem.url}
            isEditMode={true}
          />
        )}

        <div className="icon-container">
          <IconComponent type={fileItem.type} />
        </div>
        <span className="file-name">{fileItem.name}</span>
        {isItemHovered && (
          <div className="icon-container ellipsis-icon-container" onClick={this.onMenuClick}>
            <IconComponent type={"ellipsis"} />
          </div>
        )}
        {optionsMenuOpen && (
          <MenuComponent
            closeMenuFunction={this.onMenuOutsideClick}
            onRemoveItemClick={this.onRemoveItemClick}
            onEditItemClick={this.onEditItemClick}
            fileItem={fileItem}
          />
        )}
      </div>
    );
  }
}
