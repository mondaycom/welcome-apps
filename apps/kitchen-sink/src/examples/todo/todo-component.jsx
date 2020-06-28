import React from "react";
import "./todo-component.scss";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
const TODOS_KEY = "todos";

export default class TodoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todos: [], newTodoTitle: "" };
  }

  componentDidMount() {
    monday.storage.instance.getItem(TODOS_KEY).then((res) => {
      this.setTodos(res.data.value);
    });
  }

  setTodos = (value) => {
    let todos;
    try {
      todos = value ? JSON.parse(value) : [];
    } catch (err) {
      todos = [];
    }
    this.setState({ todos: todos });
  };

  saveTodos = (newTodos) => {
    this.setState({ todos: newTodos });
    const newValue = JSON.stringify(newTodos);
    monday.storage.instance.setItem(TODOS_KEY, newValue).then((res) => {});
  };

  addTodo = (title) => {
    const { todos } = this.state;
    const id = Math.random().toString(36).substr(2, 9);
    const newTodos = [...todos, { title, id }];
    this.saveTodos(newTodos);
    this.setState({ newTodoTitle: "" });
  };

  onNewTodoTitleChange = (e) => {
    const { value } = e.target;
    this.setState({ newTodoTitle: value });
  };

  toggleTodo = (todo) => {
    const { todos } = this.state;
    const newTodos = todos.map((td) => {
      return td.id == todo.id ? { ...todo, checked: !todo.checked } : td;
    });
    this.saveTodos(newTodos);
  };

  removeTodo = (todo) => {
    const { todos } = this.state;
    const newTodos = todos.filter((td) => td.id != todo.id);
    this.saveTodos(newTodos);
  };

  renderTodo = (todo) => {
    return (
      <div
        className={`todo ${todo.checked ? "checked" : ""}`}
        onClick={() => this.toggleTodo(todo)}
      >
        <div className="todo-check">
          {todo.checked ? (
            <i class="far fa-check-circle"></i>
          ) : (
            <i className="far fa-circle"></i>
          )}
        </div>
        <div className="todo-title">{todo.title}</div>
        <div
          className="todo-remove"
          onClick={(e) => {
            e.stopPropagation();
            this.removeTodo(todo);
          }}
        >
          <i class="far fa-trash-alt"></i>
        </div>
      </div>
    );
  };

  renderTodos() {
    const { todos } = this.state;
    const sortedTodos = todos.sort((a, b) => {
      if (a.checked == b.checked) return 0;
      if (a.checked) return -1;
      if (b.checked) return 1;
    });
    return <div className="todos">{sortedTodos.map(this.renderTodo)}</div>;
  }

  renderNewTodo() {
    const { newTodoTitle } = this.state;
    return (
      <div className="new-todo">
        <input
          placeholder="+ Add Todo"
          value={newTodoTitle}
          onChange={this.onNewTodoTitleChange}
          className="new-todo-input"
        />
        <button
          className="new-todo-button"
          onClick={() => this.addTodo(newTodoTitle)}
        >
          + Add
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="todos-component">
        <div className="todos-inner">
          <div className="title">Todo List</div>
          {this.renderTodos()}
          {this.renderNewTodo()}
        </div>
      </div>
    );
  }
}
