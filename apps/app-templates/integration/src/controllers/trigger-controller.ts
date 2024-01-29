import {Request, Response} from "express";
import * as console from "console";

export async function subscribe(req: Request, res: Response) {
    // TODO: Implement this function
    console.log('subscribe', req.body);
    return res.status(200).send();
}
export async function unsubscribe(req: Request, res: Response) {
  // TODO: Implement this function
  console.log('unsubscribe', req.body);
  return res.status(200).send();
}

