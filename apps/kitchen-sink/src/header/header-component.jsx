import React from "react";
import "./header-component.scss";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, context: {}, boards: [] };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
  };

  getContext = (res) => {
    this.setState({ context: res.data }, this.fetchBoards);
  };

  render() {
    const { boards } = this.state;
    return (
      <div className="header-component">
        <div className="header-inner">
          <div className="logo-wrapper">
            <div className="logo">Kitchen Sink</div>
          </div>
          <div className="header-content"></div>
        </div>
      </div>
    );
  }
}
