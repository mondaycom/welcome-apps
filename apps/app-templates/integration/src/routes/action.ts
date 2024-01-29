import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication';
import * as actionController from '../controllers/action-controller';

const router = Router();

// Custom action endpoint
// This endpoint is called when your custom action block is invoked.
// Read the docs: https://developer.monday.com/apps/docs/custom-actions
router.post('/monday/execute_action', authenticationMiddleware, actionController.executeAction);

export default router;
