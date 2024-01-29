import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import * as console from "console";

const TAG = 'authentication_middleware';
/**
 * Checks that the authorization token in the header is signed with your app's signing secret.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-header
 * @todo: Attach this middleware to every endpoint that receives requests from monday.com
 */
export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token as string;
    }

    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization as string,
      process.env.SIGNING_SECRET as string,
    ) as Record<string, never>;
     console.log('authenticated', TAG, { accountId, userId, backToUrl, shortLivedToken });
    next();
  } catch (err) {
    console.log('failed to authenticate', TAG, { error: (err as Error).message });
    res.status(401).json({ error: 'not authenticated' });
  }
}
