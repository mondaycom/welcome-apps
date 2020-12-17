const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const slackController = require('../controllers/slack-controller');

router.post('/slack/subscribe', authenticationMiddleware, slackController.subscribe);
router.post('/slack/unsubscribe', authenticationMiddleware, slackController.unsubscribe);
router.post('/slack/trigger', slackController.trigger);
router.post('/slack/action', authenticationMiddleware, slackController.action);
router.post('/slack/channels', authenticationMiddleware, slackController.channels);

module.exports = router;
