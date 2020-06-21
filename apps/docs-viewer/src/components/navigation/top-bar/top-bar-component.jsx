import React from "react";
import AddFileDialogComponent from "./add-file-dialog/add-file-dialog-component";
import { ReactComponent as SearchIcon } from "./search.svg";
import { ReactComponent as ClearIcon } from "./close.svg";
import "./top-bar-component.scss";

export default class TopBarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddFileDialogOpen: false,
      shouldShowClear: false,
    };
  }

  componentDidMount() {
    if (this._input) {
      this._input.focus();
    }
  }

  onClick = () => {
    this.setState({ isAddFileDialogOpen: true });
  };

  onDialogClose = () => {
    this.setState({ isAddFileDialogOpen: false });
  };

  onChange = (e) => {
    const { onFilterTermChange } = this.props;
    const value = e.currentTarget.value;
    onFilterTermChange(value);
    this.setState({ shouldShowClear: value ? true : false });
  };

  onClearClick = () => {
    const { onFilterTermChange } = this.props;
    const value = "";
    onFilterTermChange(value);
    this.setState({ shouldShowClear: value ? true : false });
  };

  render() {
    const { isAddFileDialogOpen, shouldShowClear } = this.state;
    const { onAfterItemAdded, searchTerm } = this.props;

    return (
      <div className="top-bar-component">
        {isAddFileDialogOpen && (
          <AddFileDialogComponent onClose={this.onDialogClose} onAfterItemAdded={onAfterItemAdded} />
        )}
        <div className="search-wrapper">
          <div className="search-icon">
            <SearchIcon />
          </div>
          {shouldShowClear && (
            <div className="clear-icon" onClick={this.onClearClick}>
              <ClearIcon />
            </div>
          )}

          <input
            placeholder="Search Files"
            onChange={this.onChange}
            value={searchTerm}
            ref={(el) => {
              this._input = el;
            }}
          />
        </div>
        <div className="button-wrapper" onClick={this.onClick}>
          +
        </div>
      </div>
    );
  }
}
