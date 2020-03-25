import React, { PureComponent } from "react";
import "./update-component.scss";

export default class PersonComponent extends PureComponent {
  render() {
    const { update } = this.props;
    const { body } = update;
    return (
      <div className="update-component">
        <div className="update-wrapper">
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </div>
    );
  }
}
