const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const authController = require('../controllers/auth-controller');

router.get('/auth', authenticationMiddleware, authController.authorize);
// auth request https://auth.monday.com/oauth2/authorize

router.get('https://auth.monday.com/oauth2/authorize?client_id=2c984df48bbeb34a02f6084b07eaad6c&redirect_uri=https://d07e-216-152-188-53.ngrok.io/auth/callback/1&response_type=code&state=1', authController.callback); 
//goes to GH to setup auth callback https://d07e-216-152-188-53.ngrok.io/auth/callback/:userId
//https://auth.monday.com/oauth2/authorize?client_id=2c984df48bbeb34a02f6084b07eaad6c&redirect_uri=https://d07e-216-152-188-53.ngrok.io/auth/callback/1&response_type=code&state=1
//replaces
// /auth/callback/:userId
module.exports = router;
