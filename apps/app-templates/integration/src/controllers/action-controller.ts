import type { Request, Response } from 'express';
import * as console from "console";

/**
 * This function runs when your action block is called from monday.
 * Docs: https://developer.monday.com/apps/docs/custom-actions
 */
export async function executeAction(req: Request, res: Response) {
  // TODO: Implement this function
  console.log('executeAction', { body: req.body });
  return res.status(200).send();
}
