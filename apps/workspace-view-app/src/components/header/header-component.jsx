import { Flex, Heading, Skeleton } from "@vibe/core";
import classes from "./header-component.module.scss";
import { useGetWorkspaceData } from "../../services/hooks";

const HeaderComponent = () => {
  const { isLoading, workspaceData } = useGetWorkspaceData();
  return (
    <Flex className={classes.headerComponent}>
      {isLoading ? (
        <Skeleton type="rectangle" />
      ) : (
        <Heading>{workspaceData?.name}</Heading>
      )}
    </Flex>
  );
};

export default HeaderComponent;
