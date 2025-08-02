import express, { json, type Request, type Response } from 'express';
import { authRoutes } from './routes/authRoutes';
import { corsMiddleware } from './middlewares/cors';
import { AuthModel } from './models/userModel';


export const createApp = () =>{
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(json())
    app.use(corsMiddleware())

    app.get("/", (req : Request, res: Response) => {
        res.send('Welcome to Node.js + TypeScript API');
    })

    const authModelInstance = new AuthModel();

    app.use("/auth", authRoutes({ authModel: authModelInstance }));

    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    }) 
}

createApp();