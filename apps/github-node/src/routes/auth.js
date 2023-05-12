const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const authController = require('../controllers/auth-controller');

router.get('/auth', authenticationMiddleware, authController.authorize);
// auth request https://auth.monday.com/oauth2/authorize

router.get('/auth/callback/:userId', authController.callback); 
//goes to GH to setup auth callback https://d07e-216-152-188-53.ngrok.io/auth/callback/:userId

module.exports = router;
