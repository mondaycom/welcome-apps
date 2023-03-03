const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

// These endpoints are called when someone creates a recipe with your trigger in monday. 
// Read the docs: https://developer.monday.com/apps/docs/custom-trigger
router.post('/monday/subscribe', authenticationMiddleware, mondayController.subscribe);
router.post('/monday/unsubscribe', authenticationMiddleware, mondayController.unsubscribe);

// This endpoint is called when your custom action is invoked. 
// Read the docs: https://developer.monday.com/apps/docs/custom-actions
router.post('/monday/execute_action', authenticationMiddleware, mondayController.executeAction);

// This endpoint defines a custom field used in this integration. 
// In this case, it returns a list of Github repos for the user to choose from. 
// Read the docs: https://developer.monday.com/apps/docs/custom-fields
router.post('/monday/get_remote_list_options', authenticationMiddleware, mondayController.getRemoteListOptions); 

// This endpoint defines a custom entity that can be mapped onto an item in monday.
// In this case, it defines a Github issue. 
// Read the docs: https://developer.monday.com/apps/docs/dynamic-mapping
router.post('/monday/get_field_defs', authenticationMiddleware, mondayController.getFieldDefs); 

module.exports = router;
