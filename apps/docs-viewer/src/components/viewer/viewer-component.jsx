import React from "react";
import EmptyStateComponent from "./empty-state/empty-state-component";
import "./viewer-component.scss";

export default class ViewerComponent extends React.Component {
  renderEmptyState() {
    const { onAfterItemAdded } = this.props;
    return <EmptyStateComponent onAfterItemAdded={onAfterItemAdded} />;
  }

  render() {
    const { item } = this.props;

    // prevent inline js code such as javascript:alert(1) as the src
    const sanitizedUrl = item && item.url.toString().startsWith("http") ? item.url : false;

    return (
      <div className="viewer-component">
        {sanitizedUrl ? <iframe className="doc-viewer" src={sanitizedUrl} /> : this.renderEmptyState()}
      </div>
    );
  }
}
