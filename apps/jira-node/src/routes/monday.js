const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/subscribe', authenticationMiddleware, mondayController.subscribe);
router.post('/unsubscribe', authenticationMiddleware, mondayController.unsubscribe);
router.post('/issuefields', authenticationMiddleware, mondayController.getFieldDefs);
router.post('/createandupdate', authenticationMiddleware, mondayController.executeAction)

module.exports = router;
