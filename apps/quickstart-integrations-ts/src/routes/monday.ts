import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/monday/execute_action', authenticationMiddleware, transformationController.executeAction);
router.post('/monday/get_remote_list_options', authenticationMiddleware, transformationController.getRemoteListOptions);

export default router;
