import { Flex } from "monday-ui-react-core";
import classes from "./app.module.scss";
import cx from "classnames";
import BoardsComponent from "./components/boards/boards-component";
import HeaderComponent from "./components/header/header-component";
import "monday-ui-react-core/dist/main.css";
import { useFetchBoards, useGetContext } from "./services/hooks";

function App() {
  const context = useGetContext();
  const { isLoading, boards } = useFetchBoards();

  return (
    <Flex
      className={cx(context.theme + "-app-theme", classes.main)}
      direction={Flex.directions.COLUMN}
      align={Flex.align.CENTER}
      justify={Flex.justify.START}
    >
      <HeaderComponent />
      <BoardsComponent boards={boards} isLoading={isLoading} />
    </Flex>
  );
}

export default App;
