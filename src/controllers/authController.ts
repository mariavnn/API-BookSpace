import { NextFunction, Request, Response } from "express"
import { UserLogin, UserRegister, validateLogin, validateRegister } from "../schemas/authSchema"
import { AuthService } from "../services/authService";
import { HttpException } from "../utils/httpException";
import jwt from "jsonwebtoken";
import { id } from "zod/v4/locales/index.cjs";
import { SECRET_JWT_KEY } from "../config/config";

export class AuthController {
    private authService : AuthService;
    constructor({ authService } : {authService: AuthService}){
        this.authService = authService;
    }

    register = async (req : Request, res : Response, next: NextFunction) => {
        const result = validateRegister(req.body);

        if(!result.success){
            return next(new HttpException(400, result.error.message))
        }

        try{
            const user = await this.authService.register(result.data as UserRegister)
            return res.status(201).json({ message: "User created successfully", user })
        }catch (err){
           next(err);
        }
    }; 

    login = async(req: Request, res: Response, next: NextFunction) => {
        const result = validateLogin(req.body);
        
        if(!result.success){
            return next(new HttpException(400, result.error.message))
        }

        try{
            const user = await this.authService.login(result.data as UserLogin)
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_JWT_KEY, {
                expiresIn: '2h'
            })
            return res
                    .cookie('access_token', token, {
                        httpOnly: true, //la cookie solo se usa en el servidor
                        secure: true, // la cookie solo se puede acceder desde https
                        sameSite: 'strict', //la cookie solo se puede acceder desde el mismo sitio (dominio),
                        maxAge: 1000 * 60 * 60 //la cookie tiene un tiempo de validez de una hora
                    })
                    .status(200).json({message: 'Successful Login'})
        }catch(err){
            next(err);
        } 

    }
}