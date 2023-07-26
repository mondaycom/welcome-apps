const { authenticationMiddleware } = require('../middlewares/authentication');
const actionController = require('../controllers/action-controller');

const router = require('express').Router();

// Custom action endpoint
// This endpoint is called when your custom action block is invoked. 
// Read the docs: https://developer.monday.com/apps/docs/custom-actions
router.post('/monday/execute_action', authenticationMiddleware, actionController.executeAction);

module.exports = router;