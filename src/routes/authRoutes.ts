import { Router } from "express";

const authRoutes = Router();

authRoutes.get("/me", requireSignin, myuser); //Route para obtener informacion personal
authRoutes.get("/user/:id", requireSignin, getUserByID) //Route para obtener informacion de un usuario

authRoutes.post("/signin", singin); //Route for user login
authRoutes.post("/signup", signup); //Router for user registration
authRoutes.post("logout", logout); //Router for log out

export default authRoutes;