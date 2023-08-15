import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import * as mondayController from '../controllers/monday-controller.js';

const router = Router();

// Custom action endpoint
// This endpoint is called when your custom action block is invoked.
// Read the docs: https://developer.monday.com/apps/docs/custom-actions
router.post('/monday/execute_action', authenticationMiddleware, mondayController.executeAction);
router.post('/monday/get_remote_list_options', authenticationMiddleware, mondayController.getRemoteListOptions);

export default router;
