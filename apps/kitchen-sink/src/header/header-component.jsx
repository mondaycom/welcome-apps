import React from "react";
import "./header-component.scss";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTabs() {
    return [
      { title: "Code", name: "code" },
      { title: "Preview", name: "preview" },
    ];
  }

  onSelectTab = (tab) => {
    const { onSelect } = this.props;
    onSelect(tab.name);
  };

  render() {
    const { selectedTab } = this.props;

    return (
      <div className="header-component">
        <div className="header-inner">
          <div className="logo-wrapper">
            <div className="logo">Kitchen Sink</div>
          </div>
          <div className="header-content">
            {this.getTabs().map((tab) => {
              const selected = tab.name == selectedTab;
              return (
                <div
                  className={`tab ${selected ? "selected" : ""}`}
                  onClick={() => this.onSelectTab(tab)}
                >
                  {tab.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
