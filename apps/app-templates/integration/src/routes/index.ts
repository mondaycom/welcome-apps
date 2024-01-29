import { Router ,Request, Response} from 'express';
import actionRoutes from './action';
import triggerRoutes from './trigger';

export const router = Router();

router.use(triggerRoutes);
router.use(actionRoutes);

router.get('/', function (req: Request, res: Response) {
  res.json(getHealth());
});

router.get('/health', function (req: Request, res: Response) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

