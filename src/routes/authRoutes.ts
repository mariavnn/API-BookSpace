import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { AuthModel } from "../models/userModel";
import { validateToken } from "../middlewares/validateToken";
import { requireSession } from "../middlewares/requireSession";

export const authRoutes = ({ authModel } : {authModel : AuthModel}) => {
    const authRouter = Router();

    const authService = new AuthService({authModel});
    const authController = new AuthController({authService});

    authRouter.get("/me", requireSession, authController.myUser); //Route para obtener informacion personal
    authRouter.patch("/me/update", requireSession, authController.updateUser);
    // authRoutes.get("/user/:id", requireSignin, getUserByID) //Route para obtener informacion de un usuario

    authRouter.post("/signin", authController.login); //Route for user login
    authRouter.post("/signup", authController.register); //Router for user registration
    // authRoutes.post("logout", logout); //Router for log out

    return authRouter;
}


