import React, { useCallback, useContext, useEffect, useState } from "react";
import "monday-ui-react-core/dist/main.css";
import "./Pagination.scss";
import mondaySdk from "monday-sdk-js";
import RenderItems from "../RenderItems/RenderItems.jsx";
import { Context } from "../../components/context/ContextProvider";
import CodeBlock from "../../components/common/CodeBlock/CodeBlock";
import Instructions from "../../components/common/Instructions/Instructions";
import ActionHeader from "../../components/common/ActionHeader/ActionHeader";
import { paginationConstants } from "./PaginationConstants";
import Button from "monday-ui-react-core/dist/Button";

const monday = mondaySdk();

const Pagination = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [isLastPage, setIsLastPage] = useState(false);
  const { boardId } = useContext(Context);

  const loadItems = useCallback(
    (page) => {
      monday
        .api(paginationConstants.paginationQuery, {
          variables: { board_id: boardId, limit, page },
        })
        .then((res) => {
          const itemsResponse = res.data.boards[0].items;
          setItems((prevItems) => [...prevItems, ...itemsResponse]);
          if (itemsResponse.length !== limit) setIsLastPage(true);
        });
    },
    [boardId, limit]
  );

  useEffect(() => {
    loadItems(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleLoadMore = () => {
    if (isLastPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="pagination-container feature-container">
      <ActionHeader
        action="Paginate items from board"
        actionDescription="Using the Monday API to paginate items data from the board"
      />
      <RenderItems
        itemsData={items}
        style={{ display: "inline-block" }}
        customComponent={
          <Button disabled={isLastPage} onClick={handleLoadMore} className="pagination-button">
            {isLastPage ? "No more items to load..." : "Load more items..."}
          </Button>
        }
      />
      <CodeBlock contentUrl={paginationConstants.githubUrl} />
      <Instructions
        paragraphs={[]}
        instructionsListItems={paginationConstants.paginationItemInstructionsListItems}
        linkToDocumentation={paginationConstants.paginationInstructionslinkToDocumentation}
        customInstruction={true}
      />
    </div>
  );
};

export default Pagination;
