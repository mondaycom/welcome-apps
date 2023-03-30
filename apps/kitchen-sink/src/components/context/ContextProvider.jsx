/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import { getAllBoardItemsQuery } from "../../utils/boardUtil";

const monday = mondaySdk();
export const Context = React.createContext();

const ContextProvider = ({ children }) => {
  const [state, setState] = useState({ items: [], updateItems: () => {}});
  const [isLoading, setIsLoading] = useState({isLoading : true});
  useEffect(() => {
    monday.listen("context", (res) => {
      if (res.data.boardIds.length === 0) {
        setIsLoading({isLoading: false});
      } else {
        setIsLoading({isLoading: true });
        monday
          .api(getAllBoardItemsQuery, {
            variables: {
              boardIds: res?.data?.boardIds,
              limit: 50,
            },
          })
          .then((itemsResponse) => {
            // ----- GETS THE ITEMS OF THE BOARD -----
            setState({
              boardId: +res.data?.boardIds[0],
              boardName: itemsResponse?.data?.boards[0]?.name,
              items: itemsResponse.data.boards[0].items.map((item) => {
                return { id: item.id, name: item.name};
              }),
              updateItems: (state) => setState(state),
            });
            setIsLoading({isLoading: false});
          });
      }
    });
  }, []);

  // TODO: fix infinite loading when there is no board connected.
  return <Context.Provider value={{...state, isLoading}}>{children}</Context.Provider>;
};

export default ContextProvider;
