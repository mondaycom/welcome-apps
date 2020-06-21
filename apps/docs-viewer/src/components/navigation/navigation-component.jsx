import React from "react";
import FileItemComponent from "./file-item/file-item-component";
import TopBarComponent from "./top-bar/top-bar-component";
import classnames from "classnames";
import "./navigation-component.scss";

const ArrowComponent = function (props) {
  const { isOpen } = props;

  return (
    <svg
      className="arrow-icon"
      transform={`rotate(${isOpen ? "180" : "0"})`}
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 11L1 6L6 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default class NavigationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isCollapsed: false };
  }

  renderFileItem = (doc) => {
    const { onClick, onRemoveItemClick, selectedItemId, onAfterItemAdded } = this.props;
    return (
      <FileItemComponent
        key={doc.id}
        selectedItemId={selectedItemId}
        fileItem={doc}
        onClick={onClick}
        onRemoveItemClick={onRemoveItemClick}
        onAfterItemAdded={onAfterItemAdded}
      />
    );
  };

  toggleIsCollapsed = () => {
    const { isCollapsed } = this.state;

    this.setState({ isCollapsed: !isCollapsed });
  };

  render() {
    const { isCollapsed } = this.state;
    const { docs, filteredDocs, onAfterItemAdded, onFilterTermChange, searchTerm } = this.props;

    return (
      <div className={classnames("navigation-component", { "is-collapsed": isCollapsed })}>
        <div onClick={this.toggleIsCollapsed} className="arrow-icon-container">
          <ArrowComponent isOpen={!isCollapsed} />
        </div>
        <div className={classnames("navigation-content-container", { "is-collapsed": isCollapsed })}>
          <TopBarComponent
            onAfterItemAdded={onAfterItemAdded}
            onFilterTermChange={onFilterTermChange}
            searchTerm={searchTerm}
          />
          {filteredDocs.length > 0 ? (
            <div className="files-list">{docs.map(this.renderFileItem)}</div>
          ) : (
            <div className="empty-state">No Files Found</div>
          )}
        </div>
      </div>
    );
  }
}
