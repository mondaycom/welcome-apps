
import { gql } from "graphql-request";

export const exampleQuery = gql`
  query GetBoards($ids: [ID!]) {
    boards(ids: $ids) {
      id
      name
    }
  }
`;

export const exampleMutation = gql`
  mutation CreateItem($boardId: ID!, $groupId: String!, $itemName: String!) {
    create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName) {
      id
      name
    }
  }
`;

export const getColumnValueQuery = gql`query GetColumnValue($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;