const router = require('express').Router();
const authRoutes = require('./auth');
const mondayRoutes = require('./monday');

router.use(authRoutes);
router.use(mondayRoutes);

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
