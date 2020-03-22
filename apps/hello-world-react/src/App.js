import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, context: {}, userName: "monday" };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.api(`query { me { name } }`).then(this.getUser)
  }

  getSettings = res => {
    this.setState({ settings: res.data });
  };

  getContext = res => {
    this.setState({ context: res.data });
  };

  getUser = res => {
    this.setState({ userName: res.data.me.name });
  };

  render() {
    const { settings, context, userName } = this.state;

    return (
      <div className="monday-app">
        <div>Hello {userName}!</div>
        <div>Your context: {JSON.stringify(context)}</div>
        <div>Your settings: {JSON.stringify(settings)}</div>
      </div>
    );
  }
}

export default App;
