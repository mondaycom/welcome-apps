import {Request, Response} from 'express';

import MondayService from '../services/monday-service';

// use this as an action to monday.com trigger
export async function executeAction(req: Request, res: Response) {
    const {shortLivedToken} = req.session;
    const {payload} = req.body;

    try {
        // TODO: Implement this function
        console.log('executeAction', {payload});
        return res.status(200).send({});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'internal server error'});
    }
}

// use this as an action to monday.com trigger
export async function  reverseString(req: Request, res: Response) {
    const {shortLivedToken} = req.session;
    const {payload} = req.body;
    try {
        const {inputFields} = payload;
        const {boardId, itemId, sourceColumnId, targetColumnId}: {
            boardId: number,
            itemId: number,
            sourceColumnId: String,
            targetColumnId: String
        } = inputFields;

        const sourceWord: String = await MondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
        if (!sourceWord) {
            await MondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, 'No word found');
            return res.status(200).send({});
        }

        const reversedWord: String = sourceWord.split('').reverse().join('');
        await MondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, reversedWord);

    } catch (e) {
        console.log(e.toString());
        return res.status(500).send({message: 'internal server error'});
    }
    return res.status(200).send({});
}