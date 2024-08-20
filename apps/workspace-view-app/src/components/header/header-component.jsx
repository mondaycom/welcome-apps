import { Flex, Heading, Skeleton } from "monday-ui-react-core";
import classes from "./header-component.module.scss";
import { useGetWorkspaceData } from "../../services/hooks";

const HeaderComponent = () => {
  const { isLoading, workspaceData } = useGetWorkspaceData();
  return (
    <Flex className={classes.headerComponent}>
      {isLoading ? (
        <Skeleton type={Skeleton.types.RECTANGLE} size={Skeleton.sizes.TEXT} />
      ) : (
        <Heading value={workspaceData?.name} />
      )}
    </Flex>
  );
};

export default HeaderComponent;
