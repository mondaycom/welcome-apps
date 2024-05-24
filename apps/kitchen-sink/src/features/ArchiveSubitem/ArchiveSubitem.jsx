import React, { useContext, useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { getSubitems } from "../../utils/subitems";
import { archiveSubitemsConstants } from "./ArchiveSubitemsConstants";
import NoSubitemsAvailable from "../../components/common/NoSubitemsAvailable/NoSubitemsAvailable";
import { useBoardContext } from "../../hooks/UseBoardContext.js";

const monday = mondaySdk();

const ArchiveSubitem = () => {
  const [subitems, setSubitems] = useState([]);
  const [, setSubitemsBoardId] = useState();
  const { boardId } = useBoardContext().state;

  useEffect(() => {
    getSubitems(boardId, setSubitems, setSubitemsBoardId);
  }, [boardId]);

  const handleArchiveSubitem = (subitemId) => {
    monday
      .api(archiveSubitemsConstants.archiveSubitemQuery, {
        variables: { item_id: subitemId },
      })
      .then((res) => {
        setSubitems(res.data?.archive_item.board?.items);
        monday.execute("notice", {
          message: "Archived!",
          type: "success",
          timeout: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="archive-subitems-container feature-container">
      <ActionHeader action="Archive subitems" actionDescription="Using the Monday API to archive subitems" />
      {subitems.length > 0 ? (
        <RenderItems
          action={(subitem) => handleArchiveSubitem(+subitem.id)}
          actionButtonContent="Archive me!"
          itemsData={subitems}
        />
      ) : (
        <NoSubitemsAvailable />
      )}
      <CodeBlock contentUrl={archiveSubitemsConstants.githubUrl} />
      <Instructions
        paragraphs={[]}
        instructionsListItems={archiveSubitemsConstants.archiveSubitemInstructionsListItems}
        linkToDocumentation={archiveSubitemsConstants.archiveSubitemInstructionslinkToDocumentation}
        customInstruction={true}
      />
    </div>
  );
};

export default ArchiveSubitem;
