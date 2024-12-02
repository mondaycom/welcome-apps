import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/api/monday/execute_action', authenticationMiddleware, transformationController.executeAction);
router.post('/api/monday/reverse_string', authenticationMiddleware, transformationController.reverseString);

export default router;
