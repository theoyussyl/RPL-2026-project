import { Request, Response, NextFunction, RequestHandler } from "express";

export function AsyncHandler(Handler: RequestHandler): RequestHandler {
  return (Request_: Request, Response_: Response, Next: NextFunction) => {
    Promise.resolve(Handler(Request_, Response_, Next)).catch(Next);
  };
}
