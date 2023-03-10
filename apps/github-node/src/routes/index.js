const router = require('express').Router();
const authRoutes = require('./auth');
const triggerRoutes = require('./trigger');
const actionRoutes = require('./action');
const fieldsRoutes = require('./fields');

router.use(authRoutes);
router.use(triggerRoutes);
router.use(actionRoutes);
router.use(fieldsRoutes);

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

module.exports = router;
