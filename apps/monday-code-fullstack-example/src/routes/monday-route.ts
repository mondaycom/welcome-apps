import { Router } from 'express';
import {
  clientAuth,
  authenticationMiddleware,
} from '../middlewares/authentication';
import {
  handleChangeColumnValue,
  handleGetColumnValue,
} from '../controllers/monday-controller';

const router = Router();

// Example routes
// These are just examples and can be removed clientAuth is used to check if the request is coming from the client
// authenticationMiddleware is used to check if the request is coming from a monday board / integration
router.post('/get-column-value', clientAuth, handleGetColumnValue);

router.post(
  '/change-column-value',
  authenticationMiddleware,
  handleChangeColumnValue
);

export default router;
