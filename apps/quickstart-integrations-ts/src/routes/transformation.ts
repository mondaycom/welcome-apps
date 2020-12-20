import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/text-transformation-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/transformation/transform', authenticationMiddleware, transformationController.transformToMondayColumn);
router.post('/transformation/types', authenticationMiddleware, transformationController.getTransformationTypes);
router.post('/transformation/subscribe', authenticationMiddleware, transformationController.subscribe);
router.post('/transformation/unsubscribe', authenticationMiddleware, transformationController.unsubscribe);

export default router;
