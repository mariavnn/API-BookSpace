import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/httpException";
import { BookService } from "../services/bookService";
import { SessionRequest } from "../middlewares/validateToken";
import { ReviewBook, validateBookInfo, validateReview } from "../schemas/bookSchema";

export class BookController{
    private bookService: BookService;

    constructor({ bookService } : {bookService: BookService}) {
        this.bookService = bookService;
    }

    searchBook = async (req: Request, res: Response, next: NextFunction) => {
        const { q, maxResults = 10, startIndex = 0 } = req.query;

        if (!q) {
            return next(new HttpException(400, "Missing query parameter"));
        }

        try {
            const result = await this.bookService.searchBooks(
                q as string,
                maxResults as number,
                startIndex as number
            );

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getReadingList = async(req: Request, res: Response, next: NextFunction) => {
        const sessionReq = req as SessionRequest; // TODO: VOLVER UN MIDDLEWARE

        try{
            const userPayload = sessionReq.session.user!; // TODO: VOLVER UN MIDDLEWARE
            const readingList = await this.bookService.getReadingList(userPayload);
            res.status(200).json(readingList);
        }catch(err){
            next(err);
        }
    }

    addBookToReadingList = async (req: Request, res: Response, next: NextFunction) => {
        const { googleId, volumenInfo } = req.body;
        const sessionReq = req as SessionRequest; // TODO: VOLVER UN MIDDLEWARE
        const result = validateBookInfo(req.body);
        

        if(!result.success){
            return next(new HttpException(400, result.error.message))
        }

        try{
            const userPayload = sessionReq.session.user!; // TODO: VOLVER UN MIDDLEWARE
            const addedBook = await this.bookService.addBookToReadingList( userPayload, googleId, volumenInfo );
            res.status(201).json(addedBook);
        }catch(err){
            next(err);
        }
    }

    createReviewPost = async(req: Request, res: Response, next: NextFunction) => {
        const sessionReq = req as SessionRequest; // TODO: VOLVER UN MIDDLEWARE
        const result = validateReview(req.body);

        if(!result.success){
            return next(new HttpException(400, result.error.message))
        }

        try{
            const userPayload = sessionReq.session.user!;
            const newPost = await this.bookService.createBookPost( userPayload, req.body as ReviewBook);
            return res.status(201).json({ message: "Reseña creada con éxito", post: newPost });
        }catch(err){
            next(err);
        }


    }
}