import { Flex } from "@vibe/core";
import classes from "./app.module.scss";
import cx from "classnames";
import BoardsComponent from "./components/boards/boards-component";
import HeaderComponent from "./components/header/header-component";
import "@vibe/core/tokens";
import { useFetchBoards, useGetContext } from "./services/hooks";

function App() {
  const context = useGetContext();
  const { isLoading, boards } = useFetchBoards();

  return (
    <Flex
      className={cx(context.theme + "-app-theme", classes.main)}
      direction="column"
      align="center"
      justify="start"
    >
      <HeaderComponent />
      <BoardsComponent boards={boards} isLoading={isLoading} />
    </Flex>
  );
}

export default App;
