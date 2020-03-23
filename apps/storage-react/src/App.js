import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: ""
    };
  }

  componentDidMount() {
    monday.storage.instance.getItem("notes").then(this.getNotes);
  }

  getNotes = res => {
    this.setState({ notes: res.data.value });
  };

  saveNotes(e) {
    let notes = e.target.value;
    this.setState({ notes });
    monday.storage.instance.setItem("notes", notes);
  };
  
  render() {
    const { notes } = this.state;

    return (
      <div className="monday-app">
        <div className="description">This is an example of how to use the storage api</div>
        <div className="notebook">
          <h5>Board Notes</h5>
          <textarea className="sticky" onChange={this.saveNotes.bind(this)} value={notes}></textarea>
        </div>
      </div>
    );
  }
}

export default App;
