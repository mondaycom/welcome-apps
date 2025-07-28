const router = require('express').Router();
const remoteOptionsController = require('../controllers/remote-options-controller');

/**
 * Provider unique identifier endpoint - POST method
 * Monday.com sends the token directly in the request body after handling OAuth
 * This is where we save the connection to the database
 */
router.post('/slack-provider-identifier', remoteOptionsController.handleSlackProviderIdentifier);

module.exports = router;
