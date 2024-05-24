import React from "react";
import ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import { ROUTES } from "./features/Menu/MenuConstants";
import Welcome from "./features/Welcome/Welcome";
import Menu from "./features/Menu/Menu";
import DeleteItem from "./features/DeleteItem/DeleteItem";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome/>
    },
    {
      path: `/${ROUTES.MENU}`,
      element: <Menu />
    },
    {
      path: `/menu/${ROUTES.DELETE_ITEM}`,
      element: <DeleteItem />
    },
  ])
  
//   const root = createRoot();
  ReactDOM.render(<RouterProvider router={router} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();