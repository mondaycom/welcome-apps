import express from "express";
import lifecycleRoutes from "./lifecycle";
const router = express.Router();

router.use("/lifecycle", lifecycleRoutes);

router.get("/", function (req, res) {
  res.json(getHealth());
});

router.get("/health", function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: "Lifecycle Events App - Healthy",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET /",
      "GET /health",
      "POST /lifecycle/sync - Sync lifecycle event processing",
      "POST /lifecycle/async - Async lifecycle event processing",
    ],
  };
}

export default router;
