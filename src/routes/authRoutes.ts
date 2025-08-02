import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { AuthModel } from "../models/userModel";

export const authRoutes = ({ authModel } : {authModel : AuthModel}) => {
    const authRouter = Router();

    const authService = new AuthService({authModel});
    const authController = new AuthController({authService});

    // authRoutes.get("/me", requireSignin, myuser); //Route para obtener informacion personal
    // authRoutes.get("/user/:id", requireSignin, getUserByID) //Route para obtener informacion de un usuario

    // authRoutes.post("/signin", singin); //Route for user login
    authRouter.post("/signup", authController.register); //Router for user registration
    // authRoutes.post("logout", logout); //Router for log out

    return authRouter;
}
 

