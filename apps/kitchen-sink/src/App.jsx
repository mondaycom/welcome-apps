import React from "react";
import ContextProvider from "./components/context/ContextProvider";
import "monday-ui-react-core/dist/main.css";
import "./App.scss";
import LayoutRouter from "./routes/LayoutRouter";

const App = () => {
  return (
    <ContextProvider>
      <LayoutRouter />
    </ContextProvider>
  );
};

export default App;
