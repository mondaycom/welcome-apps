import React from "react";
import ReactModal from "react-modal";
import AddFileComponent from "../../../add-file/add-file-component";
import "./add-file-dialog-component.scss";

export default class AddFileDialogComponent extends React.Component {
  modalOptions() {
    return {
      content: {
        padding: 0,
        top: "50%",
        left: "50%",
        right: "auto",
        width: "544px",
        height: "472px",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        transition: "all 0.4s ease",
        boxShadow: "0px 16px 24px rgba(0, 0, 0, 0.100091)",
        borderRadius: "16px",
        overflowY: "hidden",
        border: "none",
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      },
    };
  }

  render() {
    const { onClose, isEditMode, onAfterItemAdded, id, url, name } = this.props;

    return (
      <div className="add-file-dialog-component">
        <ReactModal isOpen={true} style={this.modalOptions()} onRequestClose={onClose}>
          <AddFileComponent
            onClose={onClose}
            isEditMode={isEditMode}
            onAfterItemAdded={onAfterItemAdded}
            id={id}
            url={url}
            name={name}
          />
        </ReactModal>
      </div>
    );
  }
}
