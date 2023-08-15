import { Router } from 'express';

const router = Router();

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

export default router;
