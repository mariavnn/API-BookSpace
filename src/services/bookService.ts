import axios from "axios";
import { GOOGLE_BOOK_API_KEY } from "../config/config";
import { randomUUID } from "node:crypto";
import { BookModel } from "../models/bookModel";
import { CustomJwtPayload } from "../middlewares/validateToken";
import { ReadingListBook } from "../schemas/bookSchema";
import { AddReadingListBook } from "../interfaces/types";

export class BookService{
    private bookModel : BookModel
    constructor({bookModel} : {bookModel : BookModel}){
        this.bookModel = new BookModel()
    }

    async searchBooks(query: string, maxResults: number = 10, startIndex: number = 0) {
        const response = await axios.get(
            "https://www.googleapis.com/books/v1/volumes",
            {
                params: {
                    q: query,
                    maxResults,
                    startIndex,
                    key: GOOGLE_BOOK_API_KEY
                }
            }
        );

        return {
            total: response.data.totalItems,
            books: response.data.items
        };
    }

    async addBookToReadingList (userId: CustomJwtPayload, googleId: string, volumenInfo: any){
        const bookData : AddReadingListBook = {
            id: randomUUID(),
            googleId,
            title: volumenInfo.title,
            subtitle: volumenInfo.subtitle,
            authors: volumenInfo.authors,
            publisher: volumenInfo.publisher,
            publishedDate: volumenInfo.publishedDate,
            description: volumenInfo.description,
            imageLinks: volumenInfo.imageLinks,
            status: "to-read",
            addedAt: new Date().toISOString(),
        }

        return this.bookModel.saveToReadingList(userId, bookData);
    }
}