// This file defines which functions are invoked when a particular route/endpoint is called. 

const express = require('express');
const router = express.Router();
const subscriptionRoutes = require('./subscription');

router.use(subscriptionRoutes);
router.get('/', function(req, res) {
  res.json(getHealth());
});

router.get('/health', function(req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

module.exports = router;
