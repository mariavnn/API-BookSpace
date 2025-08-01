import express, { type Request, type Response } from 'express';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

//TO DO: AGREGAR MIDDLEWARE PARA EL CORS

app.get("/", (req : Request, res: Response) => {
    res.send('Welcome to Node.js + TypeScript API');
})

app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
}) 