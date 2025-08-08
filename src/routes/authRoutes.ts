import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { AuthModel } from "../models/userModel";
import { sessionHandler } from "../middlewares/sessionHandler";

export const authRoutes = ({ authModel } : {authModel : AuthModel}) => {
    const authRouter = Router();

    const authService = new AuthService({authModel});
    const authController = new AuthController({authService});

    authRouter.get("/me", sessionHandler, authController.myUser); //Route para obtener informacion personal
    // authRoutes.get("/user/:id", requireSignin, getUserByID) //Route para obtener informacion de un usuario

    authRouter.post("/signin", authController.login); //Route for user login
    authRouter.post("/signup", authController.register); //Router for user registration
    // authRoutes.post("logout", logout); //Router for log out

    return authRouter;
}


