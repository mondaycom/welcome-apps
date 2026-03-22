import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

const subitemsQueries = {
  getAllColumnsQuery: `query ($boardIds: [Int]) {
        boards(ids: $boardIds) {
          columns {
          type
          settings_str
          }
        }
      }`,
  getSubitems: `query ($boardIds: [Int]) {
    boards(ids: $boardIds) {
      items {
        id
        name
      }
    }
  }  
`,
};

export const getSubitems = async (board_id, setSubitems, setBoardId) => {
  monday.api(subitemsQueries.getAllColumnsQuery, { variables: { boardIds: board_id } }).then((res) => {
    const subTasksColumn = res.data?.boards[0]?.columns.find((column) => column.type === "subtasks");
    if (!subTasksColumn || subTasksColumn.length === 0) return setSubitems([]);
    const subitemsBoardId = JSON.parse(subTasksColumn.settings_str).boardIds[0];
    monday.api(subitemsQueries.getSubitems, { variables: { boardIds: subitemsBoardId } }).then((res) => {
      setSubitems(res.data?.boards[0]?.items);
      setBoardId(subitemsBoardId);
    });
  });
};
