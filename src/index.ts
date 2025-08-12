import express, { json, type Request, type Response } from 'express';
import { authRoutes } from './routes/authRoutes';
import { corsMiddleware } from './middlewares/cors';
import { AuthModel } from './models/authModel';
import { errorHandler } from './middlewares/errorHandler';
import { PORT } from './config/config';
import { validateToken } from './middlewares/validateToken';
import cookieParser from 'cookie-parser';
import { bookRoutes } from './routes/bookRoutes';
import { BookModel } from './models/bookModel';


export const createApp = () =>{
    const app = express();

    //Middlewares
    app.use(json()) //Recuperar el body
    //  de la peticion 
    app.use(corsMiddleware()) // Manejo de cors
    app.use(errorHandler); //Manejo de errores 
    app.use(cookieParser()); // Manejo de cookies
    app.use(validateToken); //Validar token

    app.get("/", (req : Request, res: Response) => {
        res.send('Welcome to Node.js + TypeScript API');
    })

    const authModelInstance = new AuthModel();
    const bookModelInstance = new BookModel();

    //MODULO DE AUTH
    app.use("/auth", authRoutes({ authModel: authModelInstance }));

    //MODULO BOOKS
    app.use("/book", bookRoutes({bookModel : bookModelInstance}));

    app.listen(PORT || 3000, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    }) 
}

createApp();