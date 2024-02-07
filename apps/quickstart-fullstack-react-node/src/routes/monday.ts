import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/api/monday/execute_action', authenticationMiddleware, transformationController.executeAction);

export default router;
