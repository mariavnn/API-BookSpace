import { NextFunction, Request, Response } from "express"
import { SECRET_JWT_KEY } from "../config/config"
import jwt, { JwtPayload } from "jsonwebtoken"

export interface SessionRequest extends Request{
    session :{
        user: string | JwtPayload | null;
    }
}

export function sessionHandler(req: Request, res: Response, next: NextFunction) {
    const sessionReq = req as SessionRequest;
    const token = req.cookies?.access_token;
    sessionReq.session = { user: null };
    
    if (!token) {
        return next();
    }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        sessionReq.session.user = data;
    } catch (err) {
        sessionReq.session.user = null;
    }

    next();
}
