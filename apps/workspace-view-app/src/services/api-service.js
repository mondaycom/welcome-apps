import mondaySdk from "monday-sdk-js";
import { handleError } from "./error-handling";

const monday = mondaySdk({apiVersion: "2024-01"});
const executeGraphQl = async (query) => {
  try {
    const response = await monday.api(query);
    if (!response.data) {
      return handleError(response);
    }

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteWorkspace = async (workspaceId) => {
  const response = await executeGraphQl(`
      mutation{
        delete_workspace(workspace_id:${workspaceId}){
          id
          name
          description
          kind
        }
      }
      `);

  return response.delete_workspace;
};

export const deleteBoard = async (boardId) => {
  const response = await executeGraphQl(`
      mutation{
        delete_board(board_id:${boardId}){
          id
          name
          description
          board_kind
        }
      }
      `);

  return response.delete_board;
};

export const createItem = async (options = {}) => {
  const { name = "test item", boardId = 3155518903 } = options;
  const response = await executeGraphQl(`
  mutation{
    create_item(item_name:"${name}",board_id:${boardId}){
      id
      name
    }
  }
      `);

  return response.create_item;
};

export const getWorkspaces = async (workspaceId) => {
  if (!workspaceId) return;
  
  if (workspaceId === -1)
    return [{ id: workspaceId, name: "Main Workspace", description: "" }];
  const response = await executeGraphQl(`
      query {
        workspaces(ids:[${workspaceId}]){
          kind
          description
          name
          id
        }
      }
      `);

  return response.workspaces;
};

export const getWorkspaceBoards = async (workspaceId) => {
  const finalWorkspaceId = workspaceId === -1 ? "null" : workspaceId;
  if (!finalWorkspaceId) return;
  const response = await executeGraphQl(`
    query {
      boards(workspace_ids: [${finalWorkspaceId}], order_by: used_at, limit:20) {
        id
        name
        description
        updated_at
        creator {
          id
          name
          photo_thumb
        }
      }
    }
  `);

  return response.boards;
};

export const getDocs = async () => {
  const response = await executeGraphQl(`
      query {
        docs(limit:200){
          kind
          description
          name
          id
        }
      }
      `);

  return response.workspaces;
};

export const uploadFile = async (itemId, columnId, file) => {
  const response = await executeGraphQl(`
  mutation {
    add_file_to_column(item_id: ${itemId}, column_id: ${columnId}, file: ${file}) {
      id
      name
      url
      url_thumbnail
      public_url
      file_size
      file_extension
    }
  }
      `);

  return response.workspaces;
};

export const getSlug = async () => {
  const response = await monday.api(`
  query {
    me {
      account {
        slug
      }
    }
  }
`);
  return response.data.me.account.slug;
};
