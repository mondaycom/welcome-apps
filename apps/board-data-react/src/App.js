import React from "react";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      boardIds: [],
      boards: [],
      newItemName: ""
    };
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

    this.setState({ boardIds });
    
    this.getBoards();
  };

  getBoards() {
    const { boardIds } = this.state;
    if(boardIds.length <= 0) {
      return;
    }
    
    monday
      .api(
        `query {
      boards(ids: ${boardIds}) {
        id,
        name

        items {
          name,
          id
        }
      }
    }`
      )
      .then(res => {
        this.setState({ boards: res.data.boards });
      });
  }

  addNewItem = event => {
    event.preventDefault();
    this.createNewItem(this.state.newItemName, this.state.newItemBoard);
  };

  createNewItem(title, boardId) {
    monday
      .api(
        `mutation {
          create_item (board_id: ${boardId}, item_name: "${title}") {
          name,
          id
          }
          }`
      )
      .then(() => {
        this.getBoards()
      });
  }

  changedNewItemName = event => {
    this.setState({ newItemName: event.target.value });
  };

  changedNewItemBoard = event => {
    this.setState({ newItemBoard: event.target.value });
  };

  render() {
    const { boards } = this.state;

    let boardOptions = boards.map(board => (
      <option value={board.id} key={`sb-${board.id}`}>
        {board.name}
      </option>
    ));

    return (
      <div className="monday-app">
        <div>This is an example of how to retrieve and create board data</div>

        <div className="boards-list">
          {boards &&
            boards.map((board, key) => (
              <ul className="board" key={`board-${board.id}`}>
                <li>
                  <h2>{board.name}</h2>
                  <ul className="items">
                    {board.items &&
                      board.items.map(item => (
                        <li key={`item-${item.id}`}>{item.name}</li>
                      ))}
                  </ul>
                </li>
              </ul>
            ))}
        </div>

        <form onSubmit={this.addNewItem} className="add-item">
          <input
            type="text"
            placeholder=""
            onChange={this.changedNewItemName}
          ></input>
          <select onChange={this.changedNewItemBoard}>
            <option name="selected-board-id" id="empty-board">
              select board
            </option>
            {boardOptions}
          </select>
          <button type="submit">Add new item</button>
        </form>
      </div>
    );
  }
}

export default App;
