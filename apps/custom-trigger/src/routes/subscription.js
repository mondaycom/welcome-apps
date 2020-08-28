// This file defines which functions are invoked when a particular route/endpoint is called.

const express = require('express');
const router = express.Router();

const subscriptionController = require('../controllers/subscription-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;

router.post('/subscriptions/subscribe', authenticationMiddleware, subscriptionController.subscribe);
router.post('/subscriptions/unsubscribe', authenticationMiddleware, subscriptionController.unsubscribe);

module.exports = router;
