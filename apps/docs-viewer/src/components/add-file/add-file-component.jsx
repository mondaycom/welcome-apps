import React from "react";
import Button from "../button/button.jsx";
import "./add-file-component.scss";
import classNames from "classnames";
import { addDoc, updateDoc } from "../../services/docs-service";
import { ReactComponent as FigmaIcon } from "./images/figma.svg";
import { ReactComponent as OfficeIcon } from "./images/office.svg";
import { ReactComponent as MarvelIcon } from "./images/marvel.svg";
import { ReactComponent as MiroIcon } from "./images/miro.svg";
import { ReactComponent as DriveIcon } from "./images/drive.svg";
import { ReactComponent as VimeoIcon } from "./images/vimeo.svg";
import { ReactComponent as YouTubeIcon } from "./images/youtube.svg";

const KB_LINK = "https://support.monday.com/hc/en-us/articles/360012808679";

export default class AddFileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: props.url,
      name: props.name,
      isValid: true,
    };
  }

  handleWebsiteUrlChange = (event) => {
    const value = event.target.value;
    const isValid = value ? this.state.isValid : true;
    this.setState({ url: event.target.value, isValid });
  };

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onAddClick = async () => {
    const { name, url } = this.state;
    const { isEditMode, id, onAfterItemAdded, onClose } = this.props;
    let isValid = true;

    if (isEditMode) {
      isValid = await updateDoc(id, name, url);
    } else {
      isValid = await addDoc(name, url);
    }

    this.setState({ isValid });

    if (isValid) {
      onAfterItemAdded();
      if (onClose) onClose();
    }
  };

  renderHeader() {
    return <div className="header">View & edit your files by adding a link from apps & services like:</div>;
  }

  renderAppsIcons() {
    return (
      <div className="apps-icons">
        <div className="app-icon-wrapper">
          <FigmaIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <OfficeIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <MarvelIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <MiroIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <DriveIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <VimeoIcon className="app-icon" />
        </div>

        <div className="app-icon-wrapper">
          <YouTubeIcon className="app-icon" />
        </div>
      </div>
    );
  }

  renderUrlInput() {
    const { url, isValid } = this.state;

    return (
      <div className="input">
        <div className="label">
          <span>Website url:</span>
          <a href={KB_LINK} target="_blank" className="learn-more">
            Learn More
          </a>
        </div>
        <input
          className={classNames("text", { error: !isValid })}
          type="text"
          value={url}
          placeholder="Paste in https:/..."
          onChange={this.handleWebsiteUrlChange}
        />
        {!isValid && <div className="notice">Looks like this url is invalid. Please try another one</div>}
      </div>
    );
  }

  renderNameInput() {
    const { name } = this.state;

    return (
      <div className="input">
        <div className="label">Name your link:</div>
        <input className="text" type="text" value={name} placeholder="Type a name" onChange={this.handleNameChange} />
      </div>
    );
  }

  renderButtons() {
    const { onClose, isEditMode, shouldShowCancelButton = true } = this.props;

    return (
      <div className="buttons-container">
        {shouldShowCancelButton && (
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        )}
        <Button onClick={this.onAddClick}>{isEditMode ? "Update link" : "Embed link"}</Button>
      </div>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classNames("add-file-component", className)}>
        {this.renderHeader()}
        {this.renderAppsIcons()}
        {this.renderUrlInput()}
        {this.renderNameInput()}
        {this.renderButtons()}
      </div>
    );
  }
}
