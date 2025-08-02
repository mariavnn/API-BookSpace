import { Request, Response } from "express"
import { UserRegister, validateRegister } from "../schemas/authSchema"
import { AuthService } from "../services/authService";
import { error } from "console";

export class AuthController {
    private authService : AuthService;
    constructor({ authService } : {authService: AuthService}){
        this.authService = authService;
    }

    register = async (req : Request, res : Response) => {
        const result = validateRegister(req.body);

        if(!result.success){
            res.status(400).json({ message : result.error.message})
        }

        try{
            const user = await this.authService.register(result.data as UserRegister)
            return res.status(201).json({ message: "User created successfully", user })
        }catch (err){
            return res.status(500).json({ message : err})
        }
    }
}