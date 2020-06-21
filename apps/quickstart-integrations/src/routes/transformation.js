const express = require('express');
const router = express.Router();

const transformationController = require('../controllers/text-transformation-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;

router.post('/transformation/transform', authenticationMiddleware, transformationController.transformToMondayColumn);
router.post('/transformation/types', authenticationMiddleware, transformationController.getTransformationTypes);
router.post('/transformation/subscribe', authenticationMiddleware, transformationController.subscribe);
router.post('/transformation/unsubscribe', authenticationMiddleware, transformationController.unsubscribe);

module.exports = router;
