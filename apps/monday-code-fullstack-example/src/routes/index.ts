import express from 'express';
import mondayRoutes from './monday-route';
import appEventsRoutes from './app-webhook-events';
const router = express.Router();

// Add routes here, App.ts imports this file as the main router
router.use(mondayRoutes);
router.use(appEventsRoutes);

// serve client app
router.use(express.static('client/build'));

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

router.get('/view', function (req, res) {
  res.sendFile('index.html', { root: 'client/build/' });
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

export default router;
