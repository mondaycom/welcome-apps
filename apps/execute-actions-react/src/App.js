import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { board: {} };
  }

  componentDidMount() {
    monday
      .api(`query { boards(limit:1) { name,id, items {name, id} }}`)
      .then(this.getBoards);
  }

  getBoards = res => {
    this.setState({ board: res.data.boards[0] });
  };

  openItemCard(itemId,boardId) {
    monday.execute("openItemCard", { itemId });
  }

  render() {
    const { board } = this.state;

    return (
      <div className="monday-app">
        <div>Exampe of executing monday actions on items using our sdk</div>
        <ul className="board-items">
          {board && board.items && board.items.map( (item, key) => (
              <li key={key} onClick={this.openItemCard.bind(this, item.id)}>{item.name}</li>
            ))}
        </ul>
      </div>
    );
  }
}

export default App;
