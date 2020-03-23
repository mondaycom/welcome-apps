import React from "react";
import UpdateComponent from "./components/update/update-component";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { updates: [], settings: {} };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    this.fetchUpdates();
  }

  fetchUpdates = () => {
    const { settings } = this.state;
    const maxUpdates = settings.maxUpdates || 50;
    const query = `query { updates (limit: ${maxUpdates} ) { id, body, text_body }}`;
    monday.api(query).then(res => {
      const updates = (res && res.data && res.data.updates) || [];
      this.setState({ updates });
    });
  };

  getSettings = res => {
    this.setState({ settings: res.data }, this.fetchUpdates);
  };

  render() {
    const { updates } = this.state;

    return (
      <div className="monday-app">
        <div>Hello monday!</div>
        <div className="updates-feed">
          {updates &&
            updates.map(update => {
              return <UpdateComponent update={update} key={update.id} />;
            })}
        </div>
      </div>
    );
  }
}

export default App;
