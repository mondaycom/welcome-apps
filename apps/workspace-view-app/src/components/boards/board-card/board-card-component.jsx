import { Flex, Heading, Text } from "@vibe/core";
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
      direction="column"
      align="center"
      justify="center"
      onClick={onClick}
    >
      <Heading type="h2" maxLines={2}>
        {board.name}
      </Heading>
      <Text type="text1" maxLines={2}>
        {board.description}
      </Text>
      <Flex
        className={classes.footer}
        direction="row"
        align="center"
        justify="start"
        gap={12}
      >
        <img
          className={classes.creatorPhoto}
          src={board.creator?.photo_thumb}
          alt="owner"
        />
        <Text>
          {"Created by " + board.creator?.name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default BoardCardComponent;
