const router = require('express').Router();
const mondayRoutes = require('./monday');
const integrationRoutes = require('./integration');
const authRoutes = require('./auth');

router.use(mondayRoutes);
router.use(integrationRoutes);
router.use(authRoutes);

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
