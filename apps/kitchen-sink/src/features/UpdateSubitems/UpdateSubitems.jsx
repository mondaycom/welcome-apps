import React, { useContext, useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import "./UpdateSubitems.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { getSubitems } from "../../utils/subitems";
import { UpdateSubitemsConstants } from "./UpdateSubitemsConstants";
import NoSubitemsAvailable from "../../components/common/NoSubitemsAvailable/NoSubitemsAvailable";

const monday = mondaySdk();

const UpdateSubitem = () => {
  const [subitems, setSubitems] = useState([]);
  const [subitemsBoardId, setSubitemsBoardId] = useState();
  const { boardId } = useContext(Context);

  useEffect(() => {
    getSubitems(boardId, setSubitems, setSubitemsBoardId);
  }, [boardId]);

  const handleUpdateSubitem = (subitemId) => {
    const column_values = JSON.stringify({ name: "I Got Updated!" });
    monday
      .api(UpdateSubitemsConstants.updateSubitemName, {
        variables: { board_id: subitemsBoardId, item_id: subitemId, column_values },
      })
      .then((res) => {
        setSubitems(res.data.change_multiple_column_values.board.items);
        monday.execute("notice", {
          message: "Updated!",
          type: "success",
          timeout: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="update-subitems-container feature-container">
      <ActionHeader
        action="Update subitems value"
        actionDescription="Using the Monday API to update subitems value"
      />
      {subitems?.length > 0 ? (
        <RenderItems
          action={(subitem) => handleUpdateSubitem(+subitem.id)}
          actionButtonContent="Update me"
          itemsData={subitems}
        />
      ) : (
        <NoSubitemsAvailable />
      )}
      <CodeBlock contentUrl={UpdateSubitemsConstants.githubUrl} />
      <Instructions
        paragraphs={[]}
        instructionsListItems={UpdateSubitemsConstants.updateSubitemInstructionsListItems}
        linkToDocumentation={UpdateSubitemsConstants.updateSubitemInstructionslinkToDocumentation}
        customInstruction={true}
      />
    </div>
  );
};

export default UpdateSubitem;
