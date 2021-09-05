import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
    });

    monday.listen("context", (res) => {
      this.setState({ context: res.data });
      monday
        .api(
          `query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`,
          { variables: { boardIds: this.state.context.boardIds } }
        )
        .then((res) => {
          this.setState({ boardData: res.data });
        });
    });
  }

  render() {
    return (
      <div className="App" style={{ background: this.state.settings.background }}>
        <AttentionBox
          title={this.state.settings.attentionBoxTitle || "Default Title"}
          text={this.state.settings.attentionBoxMessage || "Default Message"}
          type={this.state.settings.attentionBoxType || "primary"}
        />
        {JSON.stringify(this.state.boardData, null, 2)}
      </div>
    );
  }
}

export default App;
