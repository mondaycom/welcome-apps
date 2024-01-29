import { authenticationMiddleware } from '../middlewares/authentication';
import * as triggerController from '../controllers/trigger-controller';
import { Router } from 'express';

const router = Router();

// Custom trigger endpoints
// These endpoints are called when someone creates or deletes a recipe with your trigger in monday.
// Read the docs: https://developer.monday.com/apps/docs/custom-trigger
router.post('/monday/subscribe', authenticationMiddleware, triggerController.subscribe);
router.post('/monday/unsubscribe', authenticationMiddleware, triggerController.unsubscribe);

export default router;
