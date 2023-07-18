import { Router } from 'express';
import authRoutes from './auth.js';
import actionRoutes from './action.js';
import fieldsRoutes from './fields.js';
import triggerRoutes from './trigger';

const router = Router();

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

export default router;
