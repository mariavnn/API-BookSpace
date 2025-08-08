import { NextFunction, Request, Response } from "express";
import { SessionRequest } from "./validateToken";
import { HttpException } from "../utils/httpException";

export function requireSession(req: Request, res: Response, next: NextFunction) {
  const sessionReq = req as SessionRequest;

  if (!sessionReq.session?.user) {
    return next(new HttpException(401, "Unauthorized"));
  }

  next();
}

