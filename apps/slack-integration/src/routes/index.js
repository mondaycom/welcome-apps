const router = require('express').Router();
const slackRoutes = require('./slack');
const authRoutes = require('./auth');

router.use(slackRoutes);
router.use(authRoutes);

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
