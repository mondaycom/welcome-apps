import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import { getAllBoardItemsQuery } from "../utils/boardUtil"; // TODO: move somewhere else

const monday = mondaySdk();

export function useBoardContext() {
    const [state, setState] = useState({ items: [], updateItems: () => {} });
    const [isLoading, setIsLoading] = useState({ isLoading: true });
  
    useEffect(() => {
      monday.listen("context", (res) => {
        console.log({ context: res });
        if (res.data.boardIds.length === 0) {
          setIsLoading({ isLoading: false });
        } else {
          setIsLoading({ isLoading: true });
          monday
            .api(getAllBoardItemsQuery, {
              variables: {
                boardIds: res?.data?.boardIds,
                limit: 50,
              },
            })
            .then((itemsResponse) => {
              console.log({ itemsResponse });
              // ----- GETS THE ITEMS OF THE BOARD -----
              setState({
                boardId: +res.data?.boardIds[0],
                boardName: itemsResponse?.data?.boards[0]?.name,
                items: itemsResponse.data.boards[0].items_page.items.map(
                  (item) => {
                    return { id: item.id, name: item.name };
                  }
                ),
                updateItems: (state) => setState(state),
              });
              setIsLoading({ isLoading: false });
            });
        }
      });
    }, []);
  
    return { state, isLoading };
  }