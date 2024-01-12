import { Flex, Heading } from "monday-ui-react-core";
import React from "react";
import classes from "./board-card-component.module.scss";
import { getAccountDetails } from "../../../services/hooks";

const BoardCardComponent = ({ board }) => {
  const onClick = async () => {
    const { baseUrl } = await getAccountDetails();
    window.open(`${baseUrl}boards/${board.id}`);
  };
  return (
    <Flex
      className={classes.boardCardComponent}
      direction={Flex.directions.COLUMN}
      align={Flex.align.CENTER}
      justify={Flex.justify.CENTER}
      onClick={onClick}
    >
      <Heading
        value={board.name}
        type={Heading.types.h2}
        ellipsisMaxLines={2}
      />
      <Heading
        value={board.description}
        type={Heading.types.h5}
        ellipsisMaxLines={2}
      />
      <Flex
        className={classes.footer}
        direction={Flex.directions.ROW}
        align={Flex.align.CENTER}
        justify={Flex.justify.START}
        gap={12}
      >
        <img
          className={classes.creatorPhoto}
          src={board.creator?.photo_thumb}
          alt="owner"
        />
        <Heading
          value={"Created by " + board.creator?.name}
          type={Heading.types.h6}
        />
      </Flex>
    </Flex>
  );
};

export default BoardCardComponent;
