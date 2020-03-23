import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { board: {} };
  }

  componentDidMount() {
    monday.listen("context", this.getContext);
  }

  getContext = res => {
    this.setState({ context: res.data });

    // normalize the data as it can be retrieved from board view or widget that
    // supports multiple boards
    let boardIds;
    if (this.state.context.boardIds) {
      boardIds = this.state.context.boardIds;
    }
    if (this.state.context.boardId) {
      boardIds = [this.state.context.boardId];
    }

    this.getBoards(boardIds);
  };

  getBoards(boardIds) {
    monday
    .api(`query { boards(limit:1, ids: ${boardIds}) { name,id, items {name, id} }}`)
    .then((res) => {
      this.setState({ board: res.data.boards[0] });
    });
  };

  openItemCard(itemId,boardId) {
    monday.execute("openItemCard", { itemId });
  }

  render() {
    const { board } = this.state;

    return (
      <div className="monday-app">
        <div className="description">Exampe of executing monday actions on items using our sdk</div>
        <div className="board-items">
          {board && board.items && board.items.map( (item, key) => (
              <div key={key} onClick={this.openItemCard.bind(this, item.id)}>{item.name}</div>
            ))}
        </div>
      </div>
    );
  }
}

export default App;
