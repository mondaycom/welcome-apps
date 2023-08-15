import { Router } from 'express';
import mondayRoutes from './monday.js';
import healthRoutes from './health.js';

const router = Router();

router.use(mondayRoutes);
router.use(healthRoutes);

export default router;
