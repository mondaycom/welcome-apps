import { Flex, Loader } from "monday-ui-react-core";
import classes from "./boards-component.module.scss";
import BoardCardComponent from "./board-card/board-card-component";

const BoardsComponent = ({ isLoading, boards }) => {
  return (
    <Flex wrap className={classes.boardsComponent}>
      {isLoading ? (
        <Loader size={Loader.sizes.LARGE} />
      ) : (
        boards?.map((board) => (
          <BoardCardComponent key={board.id} board={board} />
        ))
      )}
    </Flex>
  );
};

export default BoardsComponent;
