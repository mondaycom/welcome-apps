import {ApiClient} from '@mondaydotcomorg/api';
import {GetColumnValueQuery, GetColumnValueQueryVariables} from "../generated/graphql";
import {getColumnValueQuery} from "../queries.graphql";

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

            const params: GetColumnValueQueryVariables = { itemId: [itemId], columnId: [columnId] };
            const response: GetColumnValueQuery = await mondayClient.request<GetColumnValueQuery>(getColumnValueQuery, params);
            return response?.items?.[0]?.column_values?.[0]?.value;
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
