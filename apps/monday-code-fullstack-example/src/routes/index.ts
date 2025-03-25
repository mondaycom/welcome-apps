import express from 'express';
import mondayRoutes from './monday-route';
import appEventsRoutes from './app-webhook-events';
import outhRoutes from './oauth-route';
const router = express.Router();

// Add routes here, App.ts imports this file as the main router
// Prepend the routes with /api so that the client can use the routes via the proxy for local development
router.use('/api', mondayRoutes);
router.use('/api', appEventsRoutes);
router.use('/api', outhRoutes);

// serve client app
router.use(express.static('client/dist'));

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

router.get('/view', function (req, res) {
  res.sendFile('index.html', { root: 'client/dist/' });
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

export default router;
