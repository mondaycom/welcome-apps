import { Router } from 'express';
import {
  clientAuth,
  authenticationMiddleware,
  webhookChallenge,
} from '../middlewares/authentication';
import {
  handleChangeColumnValue,
  handleGetColumnValue,
  handleCreateWebhookAuthed,
  handleCreateUpdate,
} from '../controllers/monday-controller';

const router = Router();

// Example routes
// These are just examples and can be removed clientAuth is used to check if the request is coming from the client
// This is using the client auth middleware, this checks if something is coming from the frontend of your app
router.post('/get-column-value', clientAuth, handleGetColumnValue);

// authenticationMiddleware is used to check if the request is coming from a monday board / integration / webhook from the Monday server
router.post(
  '/change-column-value',
  authenticationMiddleware,
  handleChangeColumnValue
);

// https://developer.monday.com/api-reference/reference/webhooks
 // Additional docs in the WEBHOOKS_README.md file

// Webhook routes for create each type is in the constants.ts file
// The webhookChallenge middleware is used to handle the webhook challenge
// The constants.ts will need the real webhook urls to actually work right now its just a placeholder
// For local dev you can use the ngrok url from the BE, the ngrok url changes sometimes so be warned
// For deployed app you will use the live url
// This uses client auth so this would be for a button on the front end of your app that called api/create-webhook
router.post('/create-webhook', clientAuth, handleCreateWebhookAuthed);

// Example webhooks routes
// When creating an authed webhook the first response from the Monday server will be a challenge response and not 
// contain an auth header. The challenge response will contain a challenge key that you will need to respond
// with in order to authenticate the webhook. After the challenge response is sent, the webhook will be authenticated 
// and you will be able to receive events from the Monday server with Authetication attached.
router.post(
  '/create-update',
  webhookChallenge,
  authenticationMiddleware,
  handleCreateUpdate
);

// THere is a lifecylce webhooks example starting in the app-webhooks-events.ts file

export default router;
