import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, context: {} };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
  }

  getSettings = res => {
    this.setState({ settings: res.data });
  };

  getContext = res => {
    this.setState({ context: res.data });
  };

  render() {
    const { settings, context } = this.state;

    return (
      <div className="monday-app">
        <div>Hello monday!</div>
        <div>Your context: {JSON.stringify(context)}</div>
        <div>Your settings: {JSON.stringify(settings)}</div>
      </div>
    );
  }
}

export default App;
