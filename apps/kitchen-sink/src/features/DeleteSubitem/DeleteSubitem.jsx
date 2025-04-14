import React, { useContext, useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { getSubitems } from "../../utils/subitems";
import { deleteSubitemsConstants } from "./DeleteSubitemsConstants";
import NoSubitemsAvailable from "../../components/common/NoSubitemsAvailable/NoSubitemsAvailable";

const monday = mondaySdk();

const UpdateSubitem = () => {
  const [subitems, setSubitems] = useState([]);
  const [, setSubitemsBoardId] = useState();
  const { boardId } = useContext(Context);

  useEffect(() => {
    getSubitems(boardId, setSubitems, setSubitemsBoardId);
  }, [boardId]);

  const handleDeleteSubitem = (subitemId) => {
    monday
      .api(deleteSubitemsConstants.deleteSubitemQuery, {
        variables: { item_id: subitemId },
      })
      .then((res) => {
        setSubitems(res.data.delete_item.board.items);
        monday.execute("notice", {
          message: "Deleted!",
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
        action="Delete subitems"
        actionDescription="Using the Monday API to delete subitems the board"
      />
      {subitems.length > 0 ? (
        <RenderItems
          action={(subitem) => handleDeleteSubitem(+subitem.id)}
          actionButtonContent="Delete me!"
          itemsData={subitems}
        />
      ) : (
        <NoSubitemsAvailable />
      )}
      <CodeBlock contentUrl={deleteSubitemsConstants.githubUrl} />
      <Instructions
        paragraphs={[]}
        instructionsListItems={deleteSubitemsConstants.deleteSubitemInstructionsListItems}
        linkToDocumentation={deleteSubitemsConstants.deleteSubitemInstructionslinkToDocumentation}
        customInstruction={true}
      />
    </div>
  );
};

export default UpdateSubitem;
