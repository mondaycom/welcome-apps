// Helper functions if you want to implement OAuth in Slack from scratch, instead of using the Credentials App Feature which handles it for you. const { AuthorizationCode } = require('simple-oauth2');
const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const authController = require('../controllers/auth-controller');

router.get('/auth', authenticationMiddleware, authController.authorize);
router.get('/auth/callback/:userId', authController.callback);

module.exports = router;
