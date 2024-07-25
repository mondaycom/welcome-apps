import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import { useAppContext } from "./UseAppContext";

const monday = mondaySdk();

export function useGetBoardData() {
  const appContext = useAppContext();
  const [boardId, setBoardId] = useState();
  const [boardData, setBoardData] = useState({});

  useEffect(
    function getBoardIdFromContext() {
      if (appContext?.data?.boardIds) {
        setBoardId(appContext.data.boardIds[0]);
      } else if (appContext?.data?.boardId) {
        setBoardId(appContext.data.boardId);
      }
    },
    [appContext]
  );

  useEffect(
    function printContext() {
      if (appContext) {
        console.log({appContext});
      }
    }
  , [appContext]);

  useEffect(
    function getBoardData() {
      if (boardId) {
        monday
          .api(
            `{
            boards(ids:${boardId}) {
              id
              items_page (limit:50) {
                items {
                  id
                  name
                  column_values {
                    id
                    text
                    value
                    column {
                      type
                    }
                  }
                }
              }
              columns {
                title
                id
                type
              }
            }
          }`
          )
          .then((res) => {
            console.log(res);
            setBoardData(res.data);
          });
      }
    },
    [boardId, setBoardData]
  );

  return boardData;
}
