import React from "react";
import "./notifier-component.scss";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default class BoardTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "", users: [] };
  }

  componentDidMount() {
    monday
      .api(
        `query {
          users {
            id
            name
            photo_thumb
          }
        }`
      )
      .then((res) => {
        this.setState({ users: res.data.users });
      });
  }

  onMessageChange = (e) => {
    const { value } = e.target;
    this.setState({ message: value });
  };

  notifyUser = (user) => {
    const { message } = this.state;

    monday.api(`
    mutation {
      create_notification(user_id:${user.id},text:"${message}", target_id:459268297, target_type:Project) {
        id
      }
    }
    `);
  };

  onUserClick = (user) => {
    const { message } = this.state;
    monday
      .execute("confirm", {
        message: `Send "${message}" to ${user.name}?`,
        confirmButton: "Send",
        cancelButton: "Cancel",
      })
      .then((res) => {
        if (res.data.confirm) {
          this.notifyUser(user);
        }
      });
  };

  renderUser = (user) => {
    return (
      <div className="user" onClick={() => this.onUserClick(user)}>
        <img src={user.photo_thumb} />
        {user.name}
      </div>
    );
  };

  render() {
    const { message, users } = this.state;
    return (
      <div className="notifier-component">
        <div className="notifier-inner">
          <div className="notifier-header">
            <div className="notifier-title">
              Send notification to your team members:
            </div>
            <div className="notifier-message">
              <input
                placeholder="Type your notification message..."
                value={message}
                onChange={this.onMessageChange}
              />
            </div>
          </div>
          <div className="notifier-users">{users.map(this.renderUser)}</div>
        </div>
      </div>
    );
  }
}
