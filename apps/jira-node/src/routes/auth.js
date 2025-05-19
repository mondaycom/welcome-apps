const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const authController = require('../controllers/auth-controller');

router.get('/auth', authenticationMiddleware, authController.authorize);
router.get('/auth/monday/callback', authController.callback);

module.exports = router;
