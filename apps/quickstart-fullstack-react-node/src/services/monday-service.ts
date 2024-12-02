import {ApiClient, Board} from '@mondaydotcomorg/api';
import {gql} from "graphql-request";
import {Item} from "../generated/graphql";

class MondayService {

    static async getMe(shortLiveToken) {
        try {
            const mondayClient = new ApiClient({token: shortLiveToken});
            const me = await mondayClient.operations.getMeOp();
            return me;
        } catch (err) {
            console.log(err);
        }
    }

    static async getColumnValue(token, itemId, columnId) {
        try {
            const mondayClient = new ApiClient({token: token});
            const getColumnValue = gql`query ($itemId: [ID!], $columnId: [String!]) {items (ids: $itemId) {column_values(ids:$columnId) {value}}}`;
            const params = { itemId: [itemId], columnId: [columnId] };
            const items: Item = await mondayClient.request(getColumnValue, params );
            return items['items'][0].column_values[0].value
        } catch (err) {
            console.log(err);
        }
    }

    static async changeColumnValue(token, boardId, itemId, columnId, value) {
        try {
            const mondayClient = new ApiClient({token: token});
            const changeStatusColumn = await mondayClient.operations.changeColumnValueOp({
                boardId: boardId,
                itemId: itemId,
                columnId: columnId,
                value: value,
            });
            return changeStatusColumn;
        } catch (err) {
            console.log(err);
        }
    }
}

export default MondayService;
