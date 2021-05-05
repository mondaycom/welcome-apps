const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/monday_code/execute_action', authenticationMiddleware, mondayController.executeAction);
router.post('/monday_code/get_remote_list_options', authenticationMiddleware, mondayController.getRemoteListOptions);

module.exports = router;
