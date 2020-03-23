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

  renderBoardsOptions(boards) {
    return boards.map((board, key) => (
      <option value={board.id} key={key}>
        {board.name}
      </option>
    ));
  }

  renderAddNewItemForm() {
    const { boards } = this.state;
    let boardOptions = this.renderBoardsOptions(boards);
    return (
      <form onSubmit={this.addNewItem} className="add-item-form">
          <input
            type="text"
            placeholder=""
            onChange={this.changedNewItemName}
          ></input>
          <select onChange={this.changedNewItemBoard}>
            <option id="empty-board">
              Select board
            </option>
            {boardOptions}
          </select>
          <button type="submit">Add new item</button>
        </form>
    );
  }

  render() {
    const { boards } = this.state;
    const addNewItemForm = this.renderAddNewItemForm();

    return (
      <div className="monday-app">
        <div className="description">This is an example of how to retrieve and create board data</div>
        <div className="boards-list">
          {boards &&
            boards.map((board, key) => (
              <ul className="board" key={key}>
                <li>
                  <h2>{board.name}</h2>
                  <ul className="items">
                    {board.items &&
                      board.items.map((item, key) => (
                        <li key={key}>{item.name}</li>
                      ))}
                  </ul>
                </li>
              </ul>
            ))}
        </div>
        {addNewItemForm}
      </div>
    );
  }
}

export default App;
