const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/monday/subscribe', authenticationMiddleware, mondayController.subscribe);
router.post('/monday/unsubscribe', authenticationMiddleware, mondayController.unsubscribe);
router.post('/monday/execute_action', authenticationMiddleware, mondayController.executeAction);
router.post('/monday/get_remote_list_options', authenticationMiddleware, mondayController.getRemoteListOptions);
router.post('/monday/get_field_defs', authenticationMiddleware, mondayController.getFieldDefs);

module.exports = router;
