const router = require('express').Router();
const integrationController = require('../controllers/integration-controller');

// FIXME: check if this is still accurate
// This endpoint is where Github will send webhook events to. 
// In this case, it is called when a new issue is created. 
// For implementation, see '/apps/github-node/src/services/github-service.js'
router.post('/integration/integration-events/:subscriptionId', integrationController.integrationEventsHandler);

module.exports = router;
