import { Request, Response } from 'express';
import { getColumnValue, changeColumnValue, createWebhookOnBoardAuthed } from '../services/monday-service';
import { WEBHOOK_URLS} from '../constants/constants';
import logger from '../utils/logger';

const handleGetColumnValue = async (req: Request, res: Response) => {
  const { token } = req.session;
  const { itemId, columnId } = req.body;
  try {
    const columnValue = await getColumnValue(token, itemId, columnId);
    res.json({ columnValue });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const handleChangeColumnValue = async (req: Request, res: Response) => {
  const { token } = req.session;
  const { boardId, itemId, columnId, value } = req.body;
  try {
    const response = await changeColumnValue(
      token,
      boardId,
      itemId,
      columnId,
      value
    );
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const handleCreateWebhookAuthed = async (req: Request, res: Response) => {
  // https://developer.monday.com/api-reference/reference/webhooks
  // Additional docs in the WEBHOOKS_README.md file
  const token = req.session.token as string;
  const { boardId, eventType, config } = req.body;
  const url = WEBHOOK_URLS[eventType];

  if (!url) {
    return res.status(400).json({ error: 'Invalid event type' });
  }

  if (!boardId) {
    return res.status(400).json({ error: 'Missing board ID' });
  }

  try {
    const response = await createWebhookOnBoardAuthed(
      boardId,
      eventType,
      url,
      token,
      config
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const handleCreateUpdate = async (req: Request, res: Response) => {
  const token = req.session.token as string;

  try {
   // Dummy code for example
   //  Do stuff in your service
   //  Return the service response
    logger.info(req.body)
   // TODO replace with your own code
    return res.status(200).send(req.body);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export { 
  handleGetColumnValue, 
  handleChangeColumnValue, 
  handleCreateWebhookAuthed,
  handleCreateUpdate
};
