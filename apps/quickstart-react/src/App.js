import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
const apiAccessToken = "Enter your access token here";
monday.setToken(apiAccessToken);
monday.get("context").then((res) => console.log(res));

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners
  }

  render() {
    return (
      <div className="App">
        <AttentionBox
          title="Hello Monday Apps!"
          text="Let's start building your amazing app, which will change the world!"
          type="success"
        />
      </div>
    );
  }
}

export default App;
