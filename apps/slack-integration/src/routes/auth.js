const router = require('express').Router();
const authController = require('../controllers/auth-controller');

router.get('/auth/:userId/callback', authController.callback);
router.get('/auth', authController.authorize);

module.exports = router;
