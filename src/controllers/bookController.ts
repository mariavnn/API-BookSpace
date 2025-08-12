import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/httpException";
import axios from 'axios';
import { GOOGLE_BOOK_API_KEY } from "../config/config";
import { BookService } from "../services/bookService";
import { SessionRequest } from "../middlewares/validateToken";
import { validateReadingListBook } from "../schemas/bookSchema";

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

    addBookToReadingList = async (req: Request, res: Response, next: NextFunction) => {
        const { googleId, volumenInfo } = req.body;
        const sessionReq = req as SessionRequest;
        const result = validateReadingListBook(req.body);
        

        if(!result.success){
            return next(new HttpException(400, result.error.message))
        }

        if(!googleId || !volumenInfo){
            return next(new HttpException(400, "Missing required fields"));
        }

        try{
            const userPayload = sessionReq.session.user!;
            const addedBook = await this.bookService.addBookToReadingList( userPayload, googleId, volumenInfo );
            res.status(201).json(addedBook);
        }catch(err){
            next(err);
        }
    }
}