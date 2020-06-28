import React from "react";
import "./menu-component.scss";
import { examples } from "../examples";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default class MenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getExamples() {
    return [];
  }

  selectExample = (example) => {
    const { onSelect } = this.props;
    onSelect(example);
  };

  renderMenuItems = () => {
    const { selectedExample } = this.props;
    return (
      <div className="menu-items">
        {Object.values(examples).map((example) => {
          const selected = example.name == selectedExample?.name;
          return (
            <div
              className={`menu-item ${selected ? "selected" : ""}`}
              onClick={() => this.selectExample(example)}
            >
              {example.title}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="menu-component">
        <div className="menu-inner">{this.renderMenuItems()}</div>
      </div>
    );
  }
}
