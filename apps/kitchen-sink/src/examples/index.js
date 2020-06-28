import BoardTableComponent from "./board-table/board-table-component";
import NotifierComponent from "./notifier/notifier-component";
import TodoComponent from "./todo/todo-component";

export const examples = {
  boardTable: {
    title: "Board Table",
    name: "boardTable",
    component: BoardTableComponent,
    sourceUrl:
      "https://github.com/mondaycom/welcome-apps/blob/tal/feat-kitchen-sink/apps/kitchen-sink/src/examples/board-table/board-table-component.jsx",
  },
  notifier: {
    title: "Notify People",
    name: "notifier",
    component: NotifierComponent,
  },
  todoList: { title: "Todo List", name: "todoList", component: TodoComponent },
};
