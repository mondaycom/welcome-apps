const router = require('express').Router();
const integrationController = require('../controllers/integration-controller');

router.post('/integration/integration-events/:subscriptionId', integrationController.integrationEventsHandler);

module.exports = router;
