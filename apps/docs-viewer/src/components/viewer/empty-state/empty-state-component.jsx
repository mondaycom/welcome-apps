import React from "react";
import AddFileComponent from "../../add-file/add-file-component";
import "./empty-state-component.scss";

export default class EmptyStateComponent extends React.Component {
  render() {
    const { onAfterItemAdded } = this.props;

    return (
      <div className="empty-state-component">
        <div className="add-file-wrapper">
          <AddFileComponent isEditMode={false} onAfterItemAdded={onAfterItemAdded} shouldShowCancelButton={false} />
        </div>
      </div>
    );
  }
}
