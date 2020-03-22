import React, { PureComponent } from "react";
import "./user-component.scss";

export default class PersonComponent extends PureComponent {
  render() {
    const { user } = this.props;
    const { name, photo_thumb, title } = user;
    return (
      <div className="user-component">
        <div className="avatar">
          <img className="photo" src={photo_thumb} />
        </div>

        <div className="details">
          <div className="name">{name}</div>
          <div className="title">{title}</div>
        </div>
      </div>
    );
  }
}
