import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import * as fieldsController from '../controllers/fields-controller.js';

const router = Router();

// This endpoint defines a custom dropdown used in this integration.
// This example returns a list of Github repos for the user to choose from.
// Read the docs: https://developer.monday.com/apps/docs/custom-fields
router.post('/monday/get_remote_list_options', authenticationMiddleware, fieldsController.getRemoteListOptions);

// This endpoint defines a set of fields that can be mapped onto an item in monday.
// Read the docs: https://developer.monday.com/apps/docs/dynamic-mapping
router.post('/monday/get_field_defs', authenticationMiddleware, fieldsController.getFieldDefs);

export default router;
