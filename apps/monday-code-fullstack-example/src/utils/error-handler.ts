import { Response } from 'express';
import logger from './logger';

const errorHandler = (err: Error, res: Response, genericMessage: string) => {
  if (err.message.includes('reauth')) {
    logger.error('Reauthentication required');
    return res.status(401).send({ message: 'Reauthentication required' });
  }

  // Other error handling logic can be added here

  logger.error(err.message);
  return res.status(500).json({ error: genericMessage });
};
export default errorHandler;
