import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, context: {}, boardIds: [], boards: [] };
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

    // normalize the data as it can be retrieved from board view or widget that 
    // supports multiple boards
    let boardIds;
    if(this.state.context.boardIds) {
      boardIds = this.state.context.boardIds;
    }
    if(this.state.context.boardId) {
      boardIds = [this.state.context.boardId];
    }
    this.setState({ boardIds });

    // get boards data
    this.getBoards(boardIds);
  };

  getBoards(boardIds) {
    monday.api(`query {
      boards(ids: ${boardIds}) {
        id,
        name

        items {
          name
        }
      }
    }`).then( (res) => {
      this.setState({ boards: res.data.boards });
    } );
  };

  render() {
    const { settings, context, boards, boardIds } = this.state;

    let boardOptions = boards.map((board) =>
      <option value={board.id}>{board.name}</option>
    );

    return (
      <div className="monday-app">
        <div>This is an example of how to retrieve and create board data</div>
        <div>Your context: {JSON.stringify(context)}</div>
        <div>Your settings: {JSON.stringify(settings)}</div>
        <div>Your boardIds: {JSON.stringify(boardIds)}</div>
        <div>Your boards: {JSON.stringify(boards)}</div>
        <div className="boards-list">
          {boards && boards.map((board, key) =>
              <ul className="board">
                <li><h2>{board.name}</h2>
                  <ul className="items">
                    {board.items && board.items.map((item, key) =>
                        <li>{item.name}</li>
                    )}
                  </ul>
                </li>
              </ul>
          )}
        </div>

        <form onSubmit={this.mySubmitHandler} className="add-item">
          <input type="text" placeholder=""></input>
          <select>
            {boardOptions}
          </select>
          <button>Add new item</button>
        </form>
      </div>
    );
  }
}

export default App;
