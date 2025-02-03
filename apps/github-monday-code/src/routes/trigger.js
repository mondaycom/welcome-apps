import { authenticationMiddleware } from '../middlewares/authentication.js';
import * as triggerController from '../controllers/trigger-controller.js';
import { Router } from 'express';

const router = Router();

// Custom trigger endpoints
// These endpoints are called when someone creates or deletes a recipe with your trigger in monday.
// Read the docs: https://developer.monday.com/apps/docs/custom-trigger
router.post('/monday/subscribe', authenticationMiddleware, triggerController.subscribe);
router.post('/monday/unsubscribe', authenticationMiddleware, triggerController.unsubscribe);

/**
 * The endpoint to receive webhook events from Github. It is called when a new issue is created.
 * Each instance of the trigger block will use a unique subscription ID.
 * For implementation, see '/apps/github-node/src/services/github-service.js'
 * 
 * NOTE: You should authenticate incoming requests in a production app. 
 * For an example, see `/apps/github-node/src/middlewares/authentication.js`
 */
router.post('/integration/integration-events/:subscriptionId', triggerController.triggerEventsHandler); 

export default router;
