import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface SessionData {
  accountId: string;
  userId: string;
  shortLivedToken: string;
}

export interface AuthenticatedRequest extends Request {
  session: SessionData;
}

export default async function authenticationMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization ?? req.query?.token;

    if (typeof authorization !== "string") {
      res
        .status(401)
        .json({ error: "not authenticated, no credentials in request" });
      return;
    }

    if (typeof process.env.MONDAY_SIGNING_SECRET !== "string") {
      res.status(500).json({
        error: "Missing MONDAY_SIGNING_SECRET (should be in .env file)",
      });
      return;
    }

    const { dat: decoded } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    ) as any;

    req.session = {
      accountId: decoded.account_id,
      userId: decoded.user_id,
      shortLivedToken: decoded.short_lived_token,
    };

    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "authentication error, could not verify credentials" });
  }
}
