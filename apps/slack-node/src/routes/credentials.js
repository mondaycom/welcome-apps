const router = require('express').Router();
const remoteOptionsController = require('../controllers/remote-options-controller');

/**
 * Provider unique identifier endpoint - POST method
 */
router.post('/provider-identifier', remoteOptionsController.handleSlackProviderIdentifier);

module.exports = router;
