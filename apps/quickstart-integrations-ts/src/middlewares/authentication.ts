import jwt from "jsonwebtoken";
import express from "express";

/** Define the session property on the request object   */
declare global {
  namespace Express {
    interface Request {
      session: {
        accountId: string;
        userId: string;
        backToUrl: string | undefined;
        shortLivedToken: string | undefined;
      };
    }
  }
}

export default async function authenticationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const authorization = req.headers.authorization ?? req.query?.token;

    if (!authorization) {
      res.status(401).json({ error: "not authenticated" });
    }
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    );

    req.session = { accountId, userId, backToUrl, shortLivedToken };

    next();
  } catch (err) {
    res.status(500).json({ error: "authentication error" });
  }
}
