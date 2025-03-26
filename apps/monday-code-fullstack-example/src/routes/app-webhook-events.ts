import { Router } from 'express';
import logger from '../utils/logger';
import {
  clientAuth,
} from '../middlewares/authentication';
import { handleUninstall } from '../controllers/app-webhook-events-controller';

const router = Router();
// Webhook events route

// Handler for /app-events
// At the time of writing Lifecycle events are verified by the CLIENT_SECRET and self made authed webhooks are verified by the SIGNING_SECRET
// The route needs to be set in monday code in the Manage > Webhooks > All Events URL field
router.post('/app-events', clientAuth, (req, res) => {
  const event = req.body;

  // Check if the event has a `type` property
  if (!event || !event.type) {
    return res.status(400).send({ error: 'Invalid event format' });
  }

  logger.info(`Received event: ${event.type}`);
  // Handle different event types
  switch (event.type) {
    case 'install':
      // Logic for type 1 event
      // Add your processing logic here
      break;

    case 'uninstall':
      // Logic for type 2 event
      console.log('Handling event type 2');
      // TODO check this actually works
      handleUninstall(req, res);
      // Add your processing logic here
      break;

    case 'app_subscription_created':
      // Logic for type 3 event
      console.log('Handling event type 3');
      // Add your processing logic here
      break;

    case 'app_subscription_changed':
      // Logic for type 4 event
      console.log('Handling event type 5');
      // Add your processing logic here
      break;

    case 'app_subscription_renewed':
      // Logic for type 4 event
      console.log('Handling event type 6');
      // Add your processing logic here
      break;

    case 'app_subscription_cancelled_by_user':
      // Logic for type 4 event
      console.log('Handling event type 7');
      // Add your processing logic here
      break;

    case 'app_subscription_cancelled':
      // Logic for type 4 event
      console.log('Handling event type 8');
      // Add your processing logic here
      break;

    case 'app_subscription_cancellation_revoked_by_user':
      // Logic for type 4 event
      console.log('Handling event type 9');
      // Add your processing logic here
      break;

    case 'app_subscription_renewal_attempt_failed':
      // Logic for type 4 event
      console.log('Handling event type 10');
      // Add your processing logic here
      break;

    case 'app_subscription_renewal_failed':
      // Logic for type 4 event
      console.log('Handling event type 11');
      // Add your processing logic here
      break;

    case 'app_trial_subscription_started':
      // Logic for type 4 event
      console.log('Handling event type 12');
      // Add your processing logic here
      break;

    case 'app_trial_subscription_ended':
      // Logic for type 4 event
      console.log('Handling event type 12');
      // Add your processing logic here
      break;

    // Add cases for all event types you want to handle
    default:
      console.log(`Unhandled event type: ${event.type}`);
      return res.status(400).send({ error: 'Unsupported event type' });
  }

  // Send a success response
  res.status(200).send({ message: `${event.type} handled succesfully` });
});

export default router;
