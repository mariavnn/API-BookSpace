import { NextFunction, Request, Response } from "express"
import { SECRET_JWT_KEY } from "../config/config"
import jwt, { JwtPayload } from "jsonwebtoken"
import { HttpException } from "../utils/httpException"

export interface CustomJwtPayload extends JwtPayload{
    id: string,
    username: string
}

export interface SessionRequest extends Request{
    session :{
        user: CustomJwtPayload | null;
    }
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
    const sessionReq = req as SessionRequest;
    const token = req.cookies?.access_token;
    sessionReq.session = { user: null };
    
    if (!token) {
        return next();
    }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY) as CustomJwtPayload;
        sessionReq.session.user = data;
        
    } catch (err) {
        sessionReq.session.user = null;
    }
    next();
}
