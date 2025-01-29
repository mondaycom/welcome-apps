import { Request, Response } from 'express';
import { getColumnValue, changeColumnValue } from '../services/monday-service';

const handleGetColumnValue = async (req: Request, res: Response) => {
  const { token, itemId, columnId } = req.body;
  try {
    const columnValue = await getColumnValue(token, itemId, columnId);
    res.json({ columnValue });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const handleChangeColumnValue = async (req: Request, res: Response) => {
  const { token, boardId, itemId, columnId, value } = req.body;
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

export { handleGetColumnValue, handleChangeColumnValue };
