import React from "react";
import "./board-table-component.scss";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default class BoardTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settings: {}, context: {}, boards: [] };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
  };

  getContext = (res) => {
    this.setState({ context: res.data }, this.fetchBoards);
  };

  fetchBoards = () => {
    const { context } = this.state;
    monday
      .api(
        `
    query {
      boards(ids:[${context.boardIds}]) {
        name
        
        columns {
          title
          id
          type
        }
        
        groups {
          title
          id
        }
        
        items {
          name
          group {
            id
          }
          
          column_values {
            id
            value
            text
          }
        }
      }
    } 
    `
      )
      .then((res) => this.setState({ boards: res.data.boards }));
  };

  renderCell = (board, column, item) => {
    const columnValue = item.column_values.find(
      (columnValue) => columnValue.id == column.id
    );
    const text =
      column.type == "name" ? item.name : columnValue && columnValue.text;
    return text;
  };

  renderItem = (board, item) => {
    const { columns } = board;
    return (
      <div className="item">
        {columns.map((column) => (
          <div className="cell">{this.renderCell(board, column, item)}</div>
        ))}
      </div>
    );
  };

  renderGroup = (board, group) => {
    const { columns } = board;
    return (
      <div className="group">
        <div className="group-title">
          {columns.map((column) => (
            <div className="cell">
              {column.type == "name" ? group.title : column.title}
            </div>
          ))}
        </div>
        <div className="group-items">
          {group.items.map((item) => this.renderItem(board, item))}
        </div>
      </div>
    );
  };

  getColumnValue(item, columnId) {
    return (
      item.column_values.find((columnValue) => columnValue.id == columnId) || {}
    );
  }

  getGroups = (board) => {
    const { settings } = this.state;
    const { groupByColumn } = settings;
    const groupByColumnId = groupByColumn
      ? Object.keys(groupByColumn)[0]
      : null;

    const groups = {};
    for (const item of board.items) {
      const groupId = groupByColumnId
        ? this.getColumnValue(item, groupByColumnId).text
        : item.group.id;
      if (!groups[groupId]) {
        const groupTitle = groupByColumnId
          ? groupId
          : board.groups.find((group) => group.id == groupId).title;
        groups[groupId] = { items: [], id: groupId, title: groupTitle };
      }
      groups[groupId].items.push(item);
    }

    return Object.values(groups);
  };

  renderBoard = (board) => {
    const { settings } = this.state;
    const groups = this.getGroups(board);

    return (
      <div className="board" style={{ background: settings.color }}>
        <div className="board-name">{board.name}</div>
        <div className="board-groups">
          {groups.map((group) => this.renderGroup(board, group))}
        </div>
      </div>
    );
  };

  render() {
    const { boards } = this.state;
    return (
      <div className="board-table-component">
        <div className="boards">{boards.map(this.renderBoard)}</div>
      </div>
    );
  }
}
